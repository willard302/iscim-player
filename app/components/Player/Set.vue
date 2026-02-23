<script setup lang="ts">
import player_logo from '~/assets/img/iscim_player_logo.png';

const musicStore = useMusicStore();
const player = usePlayer();
const {removeMusicFromSet, loadMusicSet, addToLists} = useMusicSets();
const {uiState, currentItem, fieldItems, openOptions, openInfo} = useMusicDetail();

const musicSubOptions = [
  {title: 'add_to_play_list', id: 'next', icon: 'plus'},
  {title: 'remove_from_set', id: 'removeFromSet', icon: 'delete-o'}
];

const currentMusicList = computed(() => {
  if (!musicStore.currentSet || !musicStore.currentSet.content) return false;
  return musicStore.currentSet.content;
})

const hasMusic = computed(() => {
  if (!musicStore.currentSet || !musicStore.currentSet.content) return false;
  return musicStore.currentSet.content.length > 0;
});

const handleMusicAction = (actionType: string) => {
  if (!currentItem.value) return;

  switch(actionType) {
    case 'next':
      addToLists(currentItem.value);
      showSuccessToast('Add to queue');
      break;
    case 'removeFromSet':
      removeMusicFromSet(currentItem.value);
      break;
  };
  uiState.showOptions = false;
};

const handlePlayMusic = (musicItem: any) => {
  musicStore.resetMusic();
  if (!musicStore.currentSet) return;
  loadMusicSet(musicStore.currentSet);
  const index = musicStore.queue.findIndex((m:any) => m.src === musicItem.src);
  if (index === -1) return;
  player.setSourceByIndex(index);
  musicStore.setPlayerQueue(true);
};

const handlePlayMusicSet = () => {
  // musicStore.resetMusic();
  // if(!musicStore.currentSet) return;
  console.log('handlePlayMusicSet', musicStore.currentSet)

}

const formatIndex = (index: number) => {
  return String(index + 1).padStart(2, '0');
};

const handleAddMusic = () => {
  musicStore.setPlayerSetOrderMusic(true);
};

onMounted(() => {
  if (!musicStore.currentSet ) return;
  if (Array.isArray(musicStore.currentSet.content)) return;
});
</script>

<template>
  <div>
    <CommonSubHeader 
      :title="musicStore.currentSet?.name"
      left-icon="arrow-down"
      @click-left="musicStore.setPlayerSet(false)"
    />
    <div class="set-container">
      <div class="cover-wrapper">
        <van-image :src="player_logo" />
      </div>

      <div class="tab-controls">
        <van-row class="control-bar custom-button">
          <van-col>
            <van-button icon="play" :text="$t('music_sets')" @click="handlePlayMusicSet" />
          </van-col>
          <van-col>
            <van-button icon="add-square" :text="$t('add_some_music')" @click="handleAddMusic" />
          </van-col>
        </van-row>
      </div>

      <van-divider />

      <div class="set-wrapper custom-button">
        <van-button v-if="!hasMusic" @click="handleAddMusic">{{ $t('add_some_music') }}</van-button>
        <van-list v-else>
          <van-cell
            v-for="(item, index) in currentMusicList"
            :key="index"
            @click="handlePlayMusic(item)"
          >
            <template #title>
              <span class="index-number">{{ formatIndex(Number(index)) }}</span>
              <span class="item-name">{{ `${item.name} - ${item.chakra}` }}</span>
            </template>
            <template #label>
              <van-text-ellipsis
                :content="String(item.intro)"
                expand-text=""
                collapse-text=""
              />
            </template>
            <template #right-icon>
              <van-icon 
                name="ellipsis" 
                size="20" 
                @click.stop="openOptions(item)" 
              />
            </template>
          </van-cell>
        </van-list>
      </div>
    </div>
    <CommonActionMenuPopup 
      v-model:show="uiState.showOptions"
      :title="currentItem?.name"
      :actions="musicSubOptions"
      @select="handleMusicAction"
      @info="openInfo()"
    />
    <CommonInfoDetailPopup 
      v-model:show="uiState.showInfo"
      :field-items="fieldItems"
    />
  </div>

</template>

<style scoped lang="scss">
.cover-wrapper {
  display: flex;
  justify-content: center;

  .van-image {
    width: 240px;
    height: 240px;
  }
}

.control-bar {
  justify-content: space-evenly;
}

.set-wrapper {
  overflow-y: auto;
  height: 40vh;

  &.custom-button {
    text-align: center;
    .van-button {
      width: 76%;
    }
  }

  .van-cell {
    height: 60px;
  }

  :deep(.van-cell__title) {
    text-align: left;
  }
}

.index-number {
  margin-right: 10px;
  font-variant-numeric: tabular-nums;
}

.van-popup {
  overflow-y: hidden;
}
</style>
