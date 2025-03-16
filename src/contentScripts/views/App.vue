<template>
    <div ref="highlightBox" class="highlight-box"></div>
    <div id="search-modal">
        <!-- <div class="modal-background"></div> -->


        <div class="modal-content">
            <input ref="inputRef" type="text" id="search-modal-input" v-model="input" v-on:keydown="input_keydown">
            <div ref="resultsRef" id="search-modal-results">

                <div v-for="(opt, idx) in filteredResults" :class="{ selected: idx === selectedIndex }">
                    {{ opt.name }}
                </div>

            </div>
        </div>
    </div>

</template>

<script lang="ts">
import { ref, } from 'vue'
import "../../styles/main.css"

var unmountfn: any = null;

function isElementHidden(el: Element) {
    return window.getComputedStyle(el).visibility === "hidden";
}

export default defineComponent({

    props: {
        entries: {
            type: Array<ContainerEntry>,
            required: true,
        },
        onSelected: {
            type: Function,
            required: true,
        },
        getElement: {
            type: Function,
            required: true,
        }
    },
    setup(props) {
        const selfUnmount = ref(null);
        const showdisplay = ref("hidden");
        const selectedIndex = ref(0);
        const input = ref<string>("");
        const highlightBox = ref<HTMLElement | null>(null);
        const inputRef = ref<HTMLInputElement | null>(null);
        const resultsRef = ref<HTMLElement | null>(null);

        // console.log(this)
        onMounted(() => {
            nextTick(() => {
                inputRef.value?.focus({
                    preventScroll: true
                })
            })
        });

        const filteredResults: ComputedRef<ContainerEntry[]> = computed(() => {
            if (input.value === "") {
                return props.entries;
            }
            let inputWords = input.value.split(' ').map(x => x.toLowerCase());
            return props.entries.filter((x) => {
                let pred = inputWords.every(w => x.name.toLowerCase().includes(w));
                return pred;
            })
        })
        // #0D1117
        const input_keydown = (k: KeyboardEvent) => {
            k.stopPropagation()
            let total = filteredResults.value.length;
            switch (k.key) {
                case 'ArrowDown': {
                    k.preventDefault()
                    if (selectedIndex.value < total - 1) {
                        selectedIndex.value++;
                    }

                    break;
                }
                case 'ArrowRight': {
                    k.preventDefault()
                    if (selectedIndex.value < total - 1) {
                        selectedIndex.value = selectedIndex.value + 7;
                        if (selectedIndex.value > total) {
                            selectedIndex.value = total - 1;
                        }
                    }
                    break;
                }
                case 'ArrowLeft': {
                    k.preventDefault()
                    if (selectedIndex.value > 0) {
                        selectedIndex.value = selectedIndex.value - 7;
                        if (selectedIndex.value < 0) {
                            selectedIndex.value = 0;
                        }
                    }
                    break;
                }
                case 'ArrowUp': {
                    k.preventDefault()
                    if (selectedIndex.value > 0) {
                        selectedIndex.value--;
                    }
                    break;
                }
                case 'Enter': {
                    let sel = filteredResults.value[selectedIndex.value];
                    (unmountfn as any)()
                    props.onSelected(sel.index);
                    k.preventDefault()
                    return;
                }
                case 'Escape': {
                    k.preventDefault();
                    (unmountfn as any)()
                    return;
                }
                case 'End': {
                    if (k.ctrlKey) {
                        k.preventDefault();
                        selectedIndex.value = total - 1;

                    }
                    break
                }
                case 'Home': {
                    if (k.ctrlKey) {
                        k.preventDefault();
                        selectedIndex.value = 0;
                    }
                    break
                }
                case 'Control': {
                    break
                }
                default: {
                    selectedIndex.value = 0;
                    break
                }
            }
            if (total > 0) {
                let idx = selectedIndex.value + 1;
                let sel = resultsRef.value!.childNodes[idx] as HTMLElement;
                let elem_index = filteredResults.value[selectedIndex.value].index;
                sel.scrollIntoView({
                    behavior: 'instant',
                    block: 'center'
                });
                let elem = props.getElement(elem_index) as HTMLElement;
                elem.scrollIntoView({
                    behavior: 'instant',
                    block: 'center',
                    inline: 'center'
                });
                const rect = elem.getBoundingClientRect();

                console.log(rect)
                if (rect.top != -1 && !isElementHidden(elem)) {
                    highlightBox.value!.style.display = "block";
                    highlightBox.value!.style.top = `${rect.top + window.scrollY}px`;
                    highlightBox.value!.style.left = `${rect.left + window.scrollX}px`;
                    highlightBox.value!.style.width = `${rect.right - rect.left}px`;
                    highlightBox.value!.style.height = `${rect.bottom - rect.top}px`;
                }
                else {
                    highlightBox.value!.style.display = "none";
                }
            }
        };

        return {
            count: selectedIndex,
            input_keydown,
            highlightBox,
            inputRef,
            resultsRef,
            filteredResults,
            input,
            selectedIndex,
            showdisplay,
            selfUnmount,
        };
    },
    methods: {
        setUnmount(fn: Function) {
            unmountfn = fn;
        }
    }
},

)
    ;

</script>
