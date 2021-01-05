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
		getData() {
			axios.get(this.url)
				.then(res => {
          console.log(res);
					const { description, problemList } = res.data;
					this.description = description;
          this.problemList = problemList;
					this.categories = [...Object.keys(problemList)];
			});
		},
		// 控制page並呼叫render
		nextPage(status) {
			if(status === 'start') {
				this.isShowUp = true;
				this.render(0);
			}else {
				if($("[name='question']:checked").length == 0) {
					Swal.fire({
						icon: 'error',		
						text: '請挑選一個選項'
					});
				}else {
					this.render(this.page, parseInt($("[name='question']:checked").val()));
					$("[name='question']:checked")[0].checked = false;
				}
			}
		},
		// 1.透過page來設定資料並呈現畫面 2.累加分數
		render(page, value=0) {
			if(page <= 9) {
				const index = Math.floor(page % 2);
				const categoryIndex = Math.floor(page / 2);
				const category = this.categories[categoryIndex]
				this.fraction += value;

				// Object.keys(this.traits.problemList) 將keys變成一個陣列
				this.question = this.problemList[category].problems[index].problem
				this.options = this.problemList[category].problems[index].options
				if(value & index == 1) {
					console.log('record');
					const resultData = {
							category: category,
							name: this.problemList[category].name,
							fraction: this.fraction,
							description: this.problemList[category].description
					};
					this.result.push(resultData);
					console.log(this.result);
					this.fraction = 0;
				};
				this.page++;
				console.log(this.page);
				if(page == 9) {
					this.resultBtn();
				};
			}
		},
		resultBtn() {
			const resultPage = this.page - 10;
			this.resultRender(resultPage);
			this.page++;
			console.log(this.page);
		},
		resultRender(page) {
			this.desc = this.result[page].description.desc;
			this.name = this.result[page].name;
			let totalFraction = this.result[page].fraction;
			let level;
			totalFraction < 6 ? level = 'low' : totalFraction == 6 ? level = 'middle' : level = 'high';
			this.levelDescription = this.desc = this.result[page].description[level];
			switch(level) {
				case 'low':
					this.level = '低';
					break;
				case 'middle':
					this.level = '中';
					break;
				default:
					this.level = '高';
					break;
			};
		},
		restart() {
			this.page = -1;
			this.isShowUp = false;
		}
	},
	created() {
		this.getData();
	},
})