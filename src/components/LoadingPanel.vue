<template>
  <div class="loading-panel">
    <div class="loading-panel-content">
      <template v-if="stateArr[stateIndex][0]">
        <spinner-circle v-if="stateIndex === loading"></spinner-circle>
        <span v-else class="loading-panel-content-icon iconfont" :class="iconName"></span>
      </template>
      <span v-if="stateArr[stateIndex][1]" class="loading-panel-content-text">{{text}}</span>
      <button v-if="stateArr[stateIndex][2]" class="btn btn-primary loading-panel-content-button" @click.stop="onclickbutton">{{$t('loading.retry')}}</button>
    </div>
  </div>
</template>

<script>
import SpinnerCircle from "components/Spinner/SpinnerCircle"

export default {
  props: {
    loadingText: {
      type: Boolean,
      default: false
    },
    networkImage: {
      type: Boolean,
      default: false
    },
    emptyImage: {
      type: Boolean,
      default: false
    },
    emptyText: {
      type: String,
      default: null
    }
  },
  components: {
    SpinnerCircle,
  },
  data () {
    const stateArr = [
      [true, this.loadingText, false],
      [this.networkImage, true, true],
      [false, true, true],
      [this.emptyImage, true, false]
    ]
    return {
      stateArr,
      stateIndex: 0,
      loading: 0,
      networkError: 1,
      error: 2,
      empty: 3
    }
  },
  computed: {
    iconName() {
      switch (this.stateIndex) {
        case this.networkError:
          return "icon-network-error"
        case this.empty:
          return "icon-empty"
        default:
          return null
      }
    },
    text() {
      let type
      switch (this.stateIndex) {
        case this.networkError:
          type = "networkError"
          break;
        case this.error:
          type = "error"
          break;
        case this.empty:
          if (this.emptyText) return this.emptyText
          type = "empty"
          break;
        default:
          type = "loading"
          break;
      }
      return this.$t(`loading.${type}`)
    }
  },
  methods: {
    onclickbutton() {
      this.setLoading()
      this.$emit("refresh")
    },
    setLoading() {
      this.stateIndex = this.loading
    },
    setNetworkError() {
      this.stateIndex = this.networkError
    },
    setError() {
      this.stateIndex = this.error
    },
    setEmpty() {
      this.stateIndex = this.empty
    }
  }
}
</script>

<style lang="scss" >
.loading-panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;

  &-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &-icon {
      padding: 0.5rem 1rem;
      font-size: 4rem;
      line-height: 1;
    }

    &-text {
      padding: 0.5rem 1rem;
      font-size: 1.2rem;
    }

    span {
      display: block;
      color: #888888;
      text-align: center;
    }

    &-button {
      margin: 0.5rem 0;
      position: relative;
      font-size: 1.2rem;
    }
  }
}
</style>
