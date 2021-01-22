const CategoryChart = Vue.component("CategoryChart", {
    mixins: [],
    props: ["transaction", "categories"],
    template: `
        <section-block>
            <GChart
				type="PieChart"
				:data="chartData"
				:options="chartOptions"
			></GChart>
        </section-block>
    `,
    data() {
        return{
            chartOptions: {
                is3D: true,
                height: 300,
                pieHole: 0.2,
                backgroundColor: { fill:'transparent' },
                chartArea:{
                    left: 40,
                    top:0,
                    width:'90%',
                    height:'100%'
                },
                pieSliceTextStyle: {
                    fontName: "Roboto",
                    fontSize: 16,
                },
                legend: {
                    alignment: "center",
                    textStyle: {
                        fontName: "Roboto",
                        fontSize: 16,
                        color: "white"
                    }
                },
            }
        }
    },
    computed: {
        chartData() {
            const data = [];
            data.push(["Category", "Amount"]);


            // data.push(["Base", this.baseDamage.total]);
            // data.push(["Critical", this.criticalDamage.total]);
            //
            // _.forEach(this.extraDamage, dmg => {
            //     data.push([dmg.name, dmg.total]);
            // })

            return data;
        },
    }
});