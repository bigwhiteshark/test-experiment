<template>
  <header>
    <div class="wrapper"></div>
  </header>

  <main>
    <div>indexdb</div>
    <div>{{ dataIndex }}</div>
    <button ref="btnAdd">add</button>
    <button ref="btnUndo">undo</button>
    <button ref="btnRedo">redo</button>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import IndexedDB from "./lib/indexdb";
import HistoryManager from "./lib/HistoryManager";
let dataIndex = ref(0);

const historyManager = new HistoryManager({ limit: 5 });
const btnAdd = ref<HTMLButtonElement | null>(null);
const btnUndo = ref<HTMLButtonElement | null>(null);
const btnRedo = ref<HTMLButtonElement | null>(null);

const updateUI = () => {
  if (btnUndo.value) {
    btnUndo.value.disabled = !historyManager.hasUndo();
  }
  if (btnRedo.value) {
    btnRedo.value.disabled = !historyManager.hasRedo();
  }
};
onMounted(async () => {
  const db = new IndexedDB({
    dbName: "testuser",
    table: "ts_user",
    version: 1,
  });
  const key = "444";
  await db.set(key, { userName: "ddd", userCode: "vv" });
  const data = await db.get(key);
  /* setTimeout(async()=>{
    console.log('clear')
    await db.clear()
  },2000) */
  if (btnAdd.value) {
    btnAdd.value.addEventListener("click", () => {
      console.log(dataIndex.value);
      historyManager.add({
        undo: () => {
          dataIndex.value--;
          console.log("undo");
        },
        redo: () => {
          dataIndex.value++;
          console.log("redo");
        },
      });
      dataIndex.value++;
      updateUI();
    });
  }

  if (btnUndo.value) {
    btnUndo.value.addEventListener("click", () => {
      historyManager.undo();
      updateUI();
    });
  }

  if (btnRedo.value) {
    btnRedo.value.addEventListener("click", () => {
      historyManager.redo();
      updateUI();
    });
  }
  updateUI();
});
</script>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
./lib/indexdb.bak
