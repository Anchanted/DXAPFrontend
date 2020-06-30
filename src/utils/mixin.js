import translationFields from "assets/json/searchTranslationFields.json"
import campusLocationList from "assets/json/campusLocation.json"
import i18n from "locales"

const mixin = {
  data() {
    return {
      urlLocationReg: /@.*?(\?|$)/
    }
  },
  methods: {
    selectItem(item) {
      if (item.dataType) {
        this.$store.dispatch("searchHistory/saveHistoryList", { item, "unifySearchItem": this.unifySearchItem })
        if (item.dataType === 'query') {
          this.$router.push({
            name: 'SearchTop',
            query: {
              q: encodeURIComponent(item.content)
            },
            params: {
              buildingId: this.$route.params.buildingId,
              floorId: this.$route.params.floorId,
              locationInfo: this.$route.params.locationInfo
            }
          })
        } else {
          const buildingId = item.building ? item.building.id : item.building_id
          const floorId = item.floor ? item.floor.id : item.floor_id
          let params = {
            buildingId,
            floorId,
            type: item.dataType,
            id: item.id,
            name: item.name
          }
          if (`b${this.$route.params.buildingId || ""}f${this.$route.params.floorId || ""}` === `b${buildingId || ""}f${floorId || ""}`) {
            params = {
              ...params,
              locationInfo: this.$route.params.locationInfo,
              adjustPosition: true
            }
          }
          this.$router.push({
            name: 'Place',
            params 
          })
        }
      }
    },

    unifySearchItem(itemList, type) {
      const i18nVue = i18n._vm || {}
      const fallbackLocale = i18nVue.fallbackLocale || "en"
      let currentLocale = i18nVue.locale || "en"
      currentLocale = new RegExp(/^(en|zh|es)$/).test(currentLocale) ? currentLocale : fallbackLocale
      return itemList.map(e => {
        const item = JSON.parse(JSON.stringify(e || {}))
        if (new RegExp(/^(building|facility|room)$/).test(item.dataType || item.placeType)) {
          if (!item.dataType) item["dataType"] = item.placeType
          const fieldList = translationFields[item.dataType] || []
          fieldList.forEach(field => {
            item[field] = item[field + "_" + currentLocale] ? item[field + "_" + currentLocale] : item[field + "_" + fallbackLocale]
          })
        }
        return item
      })
    },

    getImageToCanvasPoint({ x = 0, y = 0 }) {
      return {
        x: x * this.scale.x * this.scaleAdaption + this.position.x + this.positionAdaption.x,
        y: y * this.scale.y * this.scaleAdaption + this.position.y + this.positionAdaption.y
      }
    },

    getCanvasToImagePoint({ x = 0, y = 0 }) {
      return {
        x: (x - this.positionAdaption.x - this.position.x) / (this.scale.x * this.scaleAdaption),
        y: (y - this.positionAdaption.y - this.position.y) / (this.scale.y * this.scaleAdaption)
      }
    },

    getGeoToImagePoint({ longitude, latitude }) {
      const p1 = campusLocationList[0]
      const p2 = campusLocationList[1]
      const ratio = {
        x: (p2["geo"]["longitude"] - p1["geo"]["longitude"]) / (p2["image"]["x"] - p1["image"]["x"]),
        y: (p2["geo"]["latitude"] - p1["geo"]["latitude"]) / (p2["image"]["y"] - p1["image"]["y"])
      }
      return {
        x: Math.floor((longitude - p1["geo"]["longitude"]) / ratio.x) + p1["image"]["x"],
        y: Math.floor((latitude - p1["geo"]["latitude"]) / ratio.y) + p1["image"]["y"]
      }
    },

    checkRouterChange(toPath = "", fromPath = "") {
      return toPath.split(this.urlLocationReg).join("") !== fromPath.split(this.urlLocationReg).join("")
    }
  }
}

export default mixin