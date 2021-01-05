"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

new Vue({
  el: '#app',
  data: {
    url: 'https://raw.githubusercontent.com/hexschool/js-training-task/master/api/BigFive.json',
    isShowUp: false,
    description: '',
    problemList: {},
    categories: [],
    options: [],
    page: -1,
    question: '',
    fraction: 0,
    result: [],
    desc: '',
    name: '',
    level: '',
    levelDescription: ''
  },
  methods: {
    // 點擊 開始測驗button之後 才抓取資料
    getData: function getData() {
      var _this = this;

      axios.get(this.url).then(function (res) {
        console.log(res);
        var _res$data = res.data,
            description = _res$data.description,
            problemList = _res$data.problemList;
        _this.description = description;
        _this.problemList = problemList;
        _this.categories = _toConsumableArray(Object.keys(problemList));
      });
    },
    // 控制page並呼叫render
    nextPage: function nextPage(status) {
      if (status === 'start') {
        this.isShowUp = true;
        this.render(0);
      } else {
        if ($("[name='question']:checked").length == 0) {
          Swal.fire({
            icon: 'error',
            text: '請挑選一個選項'
          });
        } else {
          this.render(this.page, parseInt($("[name='question']:checked").val()));
          $("[name='question']:checked")[0].checked = false;
        }
      }
    },
    // 1.透過page來設定資料並呈現畫面 2.累加分數
    render: function render(page) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (page <= 9) {
        var index = Math.floor(page % 2);
        var categoryIndex = Math.floor(page / 2);
        var category = this.categories[categoryIndex];
        this.fraction += value; // Object.keys(this.traits.problemList) 將keys變成一個陣列

        this.question = this.problemList[category].problems[index].problem;
        this.options = this.problemList[category].problems[index].options;

        if (value & index == 1) {
          console.log('record');
          var resultData = {
            category: category,
            name: this.problemList[category].name,
            fraction: this.fraction,
            description: this.problemList[category].description
          };
          this.result.push(resultData);
          console.log(this.result);
          this.fraction = 0;
        }

        ;
        this.page++;
        console.log(this.page);

        if (page == 9) {
          this.resultBtn();
        }

        ;
      }
    },
    resultBtn: function resultBtn() {
      var resultPage = this.page - 10;
      this.resultRender(resultPage);
      this.page++;
      console.log(this.page);
    },
    resultRender: function resultRender(page) {
      this.desc = this.result[page].description.desc;
      this.name = this.result[page].name;
      var totalFraction = this.result[page].fraction;
      var level;
      totalFraction < 6 ? level = 'low' : totalFraction == 6 ? level = 'middle' : level = 'high';
      this.levelDescription = this.desc = this.result[page].description[level];

      switch (level) {
        case 'low':
          this.level = '低';
          break;

        case 'middle':
          this.level = '中';
          break;

        default:
          this.level = '高';
          break;
      }

      ;
    },
    restart: function restart() {
      this.page = -1;
      this.isShowUp = false;
    }
  },
  created: function created() {
    this.getData();
  }
});
//# sourceMappingURL=all.js.map
