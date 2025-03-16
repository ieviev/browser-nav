<script setup lang="ts">

function gotoShortcuts() {
    browser.tabs.create({
        url: "chrome://extensions/shortcuts"
    })
}
</script>

<template>
    <main>
        <div>Popup</div>
        <button class="btn mt-2" @click="gotoShortcuts">
            view shortcuts
        </button>
    </main>
</template>
