const { useState, useCallback, useEffect } = React;

// --- React错误边界组件 ---
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // 更新 state 使下一次渲染能够显示降级后的 UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // 你同样可以将错误日志上报给服务器
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            // 你可以自定义降级后的 UI 并渲染
            return React.createElement('div', { className: "bg-red-50 border border-red-200 rounded-lg p-6 m-4" }, [
                React.createElement('div', { key: 'header', className: "flex items-center mb-4" }, [
                    React.createElement('span', { key: 'icon', className: "text-red-500 text-2xl mr-3" }, "⚠️"),
                    React.createElement('h2', { key: 'title', className: "text-xl font-bold text-red-800" }, "组件渲染错误")
                ]),
                React.createElement('div', { key: 'content', className: "space-y-3" }, [
                    React.createElement('p', { key: 'message', className: "text-red-700" }, 
                        `错误信息: ${this.state.error && this.state.error.toString()}`
                    ),
                    React.createElement('details', { key: 'details', className: "text-sm" }, [
                        React.createElement('summary', { key: 'summary', className: "cursor-pointer text-red-600 font-medium" }, "查看详细错误信息"),
                        React.createElement('pre', { key: 'stack', className: "mt-2 p-3 bg-red-100 rounded text-xs overflow-auto" }, 
                            this.state.errorInfo && this.state.errorInfo.componentStack
                        )
                    ]),
                    React.createElement('button', {
                        key: 'retry',
                        className: "bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors",
                        onClick: () => this.setState({ hasError: false, error: null, errorInfo: null })
                    }, "重试")
                ])
            ]);
        }

        return this.props.children;
    }
}

// --- 图标组件 ---
const FileText = () => React.createElement('span', { className: 'text-xl' }, '📄');

// --- 1. 核心配置 ---
const columnMapping = {
    productName: ['Product Name', 'Title', 'Product Title', 'Name', '商品名称', '产品名称'],
    asin: ['ASIN', 'Asin', 'Product ASIN', '商品ASIN'],
    brand: ['Brand', 'Brand Name', 'Manufacturer', '品牌', '品牌名称'],
    averagePrice: ['Average Selling Price', 'Price', 'Selling Price', 'Unit Price', '平均售价', '价格'],
    averageBSR: ['Average BSR', 'BSR', 'Best Sellers Rank', 'Sales Rank', '平均BSR', 'BSR排名'],
    totalRatings: ['Total Ratings', 'Review Count', 'Reviews', 'Rating Count', '总评论数', '评论数量'],
    averageRating: ['Average Rating', 'Rating', 'Star Rating', '平均评分', '评分'],
    sellerCount: ['Seller Count', 'Number of Sellers', 'Sellers', '卖家数量', '卖家数'],
    launchDate: ['Launch Date', 'First Available', 'Date First Available', '上架时间', '发布日期'],
    nicheClickCount: ['Niche Click Count', 'Click Count', '细分市场点击量', '点击量']
};

const ReviewTimingSection = ({ reviewAnalysis, yearlyInsights }) => {
    try {
        console.log('ReviewTimingSection - 渲染开始，数据:', reviewAnalysis);
        
        if (!reviewAnalysis || reviewAnalysis.error) {
            const errorMessage = reviewAnalysis ? reviewAnalysis.error : "时间分析数据不可用。";
            console.warn('ReviewTimingSection - 数据错误:', errorMessage);
            return React.createElement(CollapsibleSection, {
                title: React.createElement('div', { className: "flex items-center" }, [
                    React.createElement(FileText, { key: 'icon', className: "h-6 w-6 mr-3 text-gray-400" }),
                    "评论时间分析报告"
                ]),
                defaultOpen: true
            }, React.createElement('p', { className: "text-red-500 mt-4" }, `错误: ${errorMessage}`));
        }

        console.log('ReviewTimingSection - 渲染成功');
        return React.createElement(CollapsibleSection, {
            title: React.createElement('div', { className: "flex items-center" }, [
                React.createElement(FileText, { key: 'icon', className: "h-6 w-6 mr-3 text-cyan-600" }),
                "评论时间分析报告"
            ]),
            defaultOpen: false
        }, [
            React.createElement('div', { key: 'summary', className: "bg-gray-50 border p-4 rounded-lg mb-6" }, [
                React.createElement('h4', { className: "font-semibold text-gray-800" }, "执行摘要"),
                React.createElement('ul', { className: "list-disc pl-5 text-sm text-gray-700 mt-2 space-y-1" }, [
                    React.createElement('li', { key: 'scope' }, reviewAnalysis.scope),
                    React.createElement('li', { key: 'timeRange' }, reviewAnalysis.timeRange),
                    React.createElement('li', { key: 'status', className: "flex items-center" }, [
                        "市场状态: ",
                        React.createElement('span', { className: `ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-${reviewAnalysis.marketStatus.color}-100 text-${reviewAnalysis.marketStatus.color}-800` }, reviewAnalysis.marketStatus.text)
                    ]),
                ])
            ]),
            React.createElement('div', { key: 'trends-table', className: "overflow-x-auto" }, [
                React.createElement('h4', { className: "font-semibold text-gray-800 mb-3 text-lg" }, "1. 市场生命周期分析"),
                React.createElement('table', { className: "w-full text-sm border-collapse" }, [
                    React.createElement('thead', { className: "bg-gray-100" }, [
                         React.createElement('tr', { key: 'header-row' }, ['年份', '新品数', '新品牌', '总评论数', '平均评论/产品', '市场关注度'].map(h => React.createElement('th', { key: h, className: "px-4 py-2 text-left font-semibold text-gray-700 border" }, h)))
                    ]),
                    React.createElement('tbody', {},
                        reviewAnalysis.yearlyTrends.map(trend => React.createElement('tr', { key: trend.year, className: "border-t" }, [
                            React.createElement('td', { className: "px-4 py-2 border font-medium" }, trend.year),
                            React.createElement('td', { className: "px-4 py-2 border text-center" }, trend.newProducts),
                            React.createElement('td', { className: "px-4 py-2 border text-center" }, trend.newBrands),
                            React.createElement('td', { className: "px-4 py-2 border text-center" }, trend.totalReviews),
                            React.createElement('td', { className: "px-4 py-2 border text-center" }, trend.avgReviews.toFixed(1)),
                            React.createElement('td', { className: "px-4 py-2 border text-center" }, trend.marketAttention),
                        ]))
                    )
                ]),
                // AI 趋势洞察区域
                yearlyInsights && React.createElement('div', { key: 'ai-insights', className: "mt-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4" }, [
                    React.createElement('h4', { className: "font-semibold text-gray-800 mb-3 text-lg flex items-center" }, [
                        React.createElement('span', { key: 'brain-icon', className: "mr-2 text-xl" }, "🧠"),
                        "AI趋势洞察"
                    ]),
                    React.createElement('div', { className: "text-sm text-gray-700 leading-relaxed" }, 
                        yearlyInsights.split('**').map((part, index) => {
                            if (index % 2 === 1) {
                                // 加粗的部分
                                return React.createElement('strong', { key: index, className: "text-purple-700" }, part);
                            } else {
                                // 普通文本部分
                                return part;
                            }
                        })
                    )
                ])
            ])
        ]);
    } catch (error) {
        console.error('ReviewTimingSection - 渲染错误:', error);
        return React.createElement('div', { className: "bg-red-50 border border-red-200 rounded-lg p-4" }, [
            React.createElement('p', { className: "text-red-700" }, `评论时间分析组件渲染失败: ${error.message}`)
        ]);
    }
};

const LifecycleAnalysisSection = ({ lifecycleAnalysis, strategicInsights }) => {
    try {
        console.log('LifecycleAnalysisSection - 渲染开始，生命周期分析数据:', lifecycleAnalysis);
        
        if (!lifecycleAnalysis) {
            console.warn('LifecycleAnalysisSection - 生命周期分析数据不可用');
            return React.createElement('div', { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-4" }, [
                React.createElement('p', { className: "text-yellow-700" }, "产品生命周期分析数据不可用")
            ]);
        }
        
        const { key_insights, stages_analysis, analysis_summary } = lifecycleAnalysis;
        
        console.log('LifecycleAnalysisSection - 渲染成功');
        return React.createElement(CollapsibleSection, {
            title: React.createElement('span', { className: "flex items-center" }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-green-600" }, "🔄"),
                "产品评论壁垒与生命周期机会分析"
            ]),
            titleClassName: "text-xl font-bold text-gray-900 flex items-center",
            defaultOpen: false
        }, [
            React.createElement('div', { key: 'content', className: "space-y-6" }, [
                // 关键洞察卡片
                key_insights && React.createElement('div', { key: 'insights', className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" }, [
                    React.createElement('div', { key: 'barrier', className: "bg-blue-50 rounded-lg p-4 border border-blue-200" }, [
                        React.createElement('h4', { key: 'title', className: "font-semibold text-blue-800 mb-2 flex items-center" }, [
                            React.createElement('span', { key: 'icon', className: "mr-2" }, "🚧"),
                            "评论壁垒"
                        ]),
                        React.createElement('p', { key: 'value', className: "text-blue-700 font-bold" }, key_insights.review_barrier)
                    ]),
                    React.createElement('div', { key: 'vitality', className: "bg-green-50 rounded-lg p-4 border border-green-200" }, [
                        React.createElement('h4', { key: 'title', className: "font-semibold text-green-800 mb-2 flex items-center" }, [
                            React.createElement('span', { key: 'icon', className: "mr-2" }, "💪"),
                            "市场活力"
                        ]),
                        React.createElement('p', { key: 'value', className: "text-green-700 font-bold" }, key_insights.market_vitality)
                    ]),
                    React.createElement('div', { key: 'opportunity', className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200" }, [
                        React.createElement('h4', { key: 'title', className: "font-semibold text-yellow-800 mb-2 flex items-center" }, [
                            React.createElement('span', { key: 'icon', className: "mr-2" }, "🎯"),
                            "机会窗口"
                        ]),
                        React.createElement('p', { key: 'value', className: "text-yellow-700 font-bold" }, key_insights.opportunity_window)
                    ]),
                    React.createElement('div', { key: 'disruption', className: "bg-purple-50 rounded-lg p-4 border border-purple-200" }, [
                        React.createElement('h4', { key: 'title', className: "font-semibold text-purple-800 mb-2 flex items-center" }, [
                            React.createElement('span', { key: 'icon', className: "mr-2" }, "⚡"),
                            "颠覆可能性"
                        ]),
                        React.createElement('p', { key: 'value', className: "text-purple-700 font-bold" }, key_insights.disruption_possibility)
                    ])
                ]),
                
                // 生命周期阶段分析表格
                stages_analysis && React.createElement('div', { key: 'stages', className: "bg-white rounded-lg border overflow-hidden" }, [
                    React.createElement('div', { key: 'header', className: "bg-gray-50 px-6 py-4 border-b" }, [
                        React.createElement('h4', { key: 'title', className: "font-semibold text-gray-800 flex items-center" }, [
                            React.createElement('span', { key: 'icon', className: "mr-2" }, "📊"),
                            "各生命周期阶段详细数据"
                        ])
                    ]),
                    React.createElement('div', { key: 'table-container', className: "overflow-x-auto" }, [
                        React.createElement('table', { key: 'table', className: "w-full text-sm" }, [
                            React.createElement('thead', { key: 'thead', className: "bg-gray-100" }, [
                                React.createElement('tr', { key: 'header-row' }, [
                                    React.createElement('th', { key: 'stage', className: "px-4 py-3 text-left font-semibold text-gray-700" }, "生命周期阶段"),
                                    React.createElement('th', { key: 'age', className: "px-4 py-3 text-left font-semibold text-gray-700" }, "年龄范围"),
                                    React.createElement('th', { key: 'count', className: "px-4 py-3 text-center font-semibold text-gray-700" }, "产品数量"),
                                    React.createElement('th', { key: 'percentage', className: "px-4 py-3 text-center font-semibold text-gray-700" }, "占比"),
                                    React.createElement('th', { key: 'avg-reviews', className: "px-4 py-3 text-center font-semibold text-gray-700" }, "平均评论数"),
                                    React.createElement('th', { key: 'median-reviews', className: "px-4 py-3 text-center font-semibold text-gray-700" }, "评论数中位数"),
                                    React.createElement('th', { key: 'monthly-growth', className: "px-4 py-3 text-center font-semibold text-gray-700" }, "月均评论增长")
                                ])
                            ]),
                            React.createElement('tbody', { key: 'tbody' }, 
                                stages_analysis.map((stage, index) => 
                                    React.createElement('tr', { key: index, className: index % 2 === 0 ? "bg-white" : "bg-gray-50" }, [
                                        React.createElement('td', { key: 'stage-name', className: "px-4 py-3 font-medium text-gray-900" }, stage.stageName),
                                        React.createElement('td', { key: 'age-range', className: "px-4 py-3 text-gray-600" }, stage.ageRange),
                                        React.createElement('td', { key: 'product-count', className: "px-4 py-3 text-center font-semibold" }, stage.productCount),
                                        React.createElement('td', { key: 'product-percentage', className: "px-4 py-3 text-center" }, stage.productPercentage),
                                        React.createElement('td', { key: 'avg-reviews', className: "px-4 py-3 text-center" }, stage.avgReviews.toFixed(1)),
                                        React.createElement('td', { key: 'median-reviews', className: "px-4 py-3 text-center" }, stage.medianReviews.toFixed(1)),
                                        React.createElement('td', { key: 'monthly-growth', className: "px-4 py-3 text-center font-semibold text-blue-600" }, stage.avgMonthlyGrowth.toFixed(1))
                                    ])
                                )
                            )
                        ])
                    ])
                ]),
                
                // 分析总结
                analysis_summary && React.createElement('div', { key: 'summary', className: "bg-indigo-50 rounded-lg p-6 border border-indigo-200" }, [
                    React.createElement('h4', { key: 'title', className: "font-semibold text-indigo-800 mb-3 flex items-center" }, [
                        React.createElement('span', { key: 'icon', className: "mr-2" }, "📝"),
                        "分析总结"
                    ]),
                    React.createElement('p', { key: 'text', className: "text-indigo-700 leading-relaxed" }, analysis_summary)
                ]),
                
                // 战略洞察
                strategicInsights && React.createElement('div', { key: 'strategic-insights', className: "bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200" }, [
                    React.createElement('h4', { key: 'title', className: "font-semibold text-purple-800 mb-4 flex items-center" }, [
                        React.createElement('span', { key: 'icon', className: "mr-2" }, "🧠"),
                        "AI战略洞察"
                    ]),
                    React.createElement('div', { key: 'content', className: "text-purple-700 leading-relaxed whitespace-pre-line" }, strategicInsights)
                ])
            ])
        ]);
    } catch (error) {
        console.error('LifecycleAnalysisSection - 渲染错误:', error);
        return React.createElement('div', { className: "bg-red-50 border border-red-200 rounded-lg p-4" }, [
            React.createElement('p', { className: "text-red-700" }, `产品生命周期分析渲染失败: ${error.message}`)
        ]);
    }
};

const EmergingTrendsSection = ({ analysisData }) => {
    try {
        console.log('EmergingTrendsSection - 渲染开始，数据:', analysisData);
        
        if (!analysisData || analysisData.error) {
            const errorMessage = analysisData ? analysisData.error : "新兴趋势分析数据不可用。";
            console.warn('EmergingTrendsSection - 数据错误:', errorMessage);
            return React.createElement(CollapsibleSection, {
                title: React.createElement('div', { className: "flex items-center" }, [
                    React.createElement('span', { key: 'icon', className: "text-2xl mr-3" }, "🔍"),
                    "新兴趋势与异常信号探测器"
                ]),
                defaultOpen: false
            }, React.createElement('p', { className: "text-red-500 mt-4" }, `错误: ${errorMessage}`));
        }

        const { top_newcomers = [], quality_opportunities = [], emerging_keywords = [], ai_insights = "" } = analysisData;

        console.log('EmergingTrendsSection - 渲染成功');
        return React.createElement(CollapsibleSection, {
            title: React.createElement('div', { className: "flex items-center" }, [
                React.createElement('span', { key: 'icon', className: "text-2xl mr-3" }, "🔍"),
                "新兴趋势与异常信号探测器"
            ]),
            defaultOpen: false
        }, [
            React.createElement('div', { key: 'content', className: "grid grid-cols-1 lg:grid-cols-3 gap-6" }, [
                // 近期黑马榜卡片
                React.createElement('div', { key: 'newcomers', className: "bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6" }, [
                    React.createElement('h4', { key: 'title', className: "font-bold text-lg text-green-800 mb-4 flex items-center" }, [
                        React.createElement('span', { key: 'icon', className: "mr-2" }, "📈"),
                        "近期黑马榜"
                    ]),
                    top_newcomers.length > 0 ? 
                        React.createElement('div', { key: 'list', className: "space-y-3" }, 
                            top_newcomers.map((product, index) => 
                                React.createElement('div', { key: index, className: "bg-white rounded-lg p-3 border border-green-100" }, [
                                    React.createElement('div', { key: 'header', className: "flex items-center justify-between mb-1" }, [
                                        React.createElement('div', { key: 'name', className: "font-medium text-gray-900 text-sm flex-1" }, 
                                            product.productName || '未知产品'
                                        ),
                                        React.createElement('div', { key: 'badge', className: "flex items-center ml-2" }, [
                                            // 真实性徽章
                                            product.is_authentic ? 
                                                React.createElement('span', { key: 'authentic', className: "text-green-600 text-lg" }, "✅") :
                                                React.createElement('div', { key: 'warning', className: "flex items-center" }, [
                                                    React.createElement('span', { key: 'flag', className: "text-red-600 text-lg mr-1" }, "🚩"),
                                                    React.createElement('span', { 
                                                        key: 'tooltip', 
                                                        className: "text-gray-500 text-sm cursor-help",
                                                        title: "该产品的评论增长与其销量和市场平均留评率不符，可能存在非自然增长，请谨慎参考。"
                                                    }, "❓")
                                                ])
                                        ])
                                    ]),
                                    React.createElement('div', { key: 'stats', className: "flex justify-between text-xs text-gray-600" }, [
                                        React.createElement('span', { key: 'rating' }, `评分: ${(product.rating || 0).toFixed(1)}`),
                                        React.createElement('div', { key: 'growth', className: "flex items-center" }, [
                                            React.createElement('span', { key: 'text' }, `月均获评速度: ${(product.avg_monthly_reviews || 0).toFixed(1)}`),
                                            React.createElement('span', { 
                                                key: 'tooltip', 
                                                className: "ml-1 text-gray-400 cursor-help text-xs",
                                                title: "什么是月均获评速度？\n\n该指标衡量了产品从上市至今，获取评论的平均速度。它并非指每月固定增长的数量，而是一个标准化的'冲劲'指标，用于公平比较新老产品的市场受欢迎程度。指数越高，表明产品在当前生命周期内的市场动能越强。"
                                            }, "ⓘ")
                                        ])
                                    ])
                                ])
                            )
                        ) : 
                        React.createElement('p', { key: 'empty', className: "text-gray-500 text-sm" }, "暂无新品黑马数据")
                ]),
                
                // 质量改进机会卡片
                React.createElement('div', { key: 'opportunities', className: "bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-6" }, [
                    React.createElement('h4', { key: 'title', className: "font-bold text-lg text-yellow-800 mb-4 flex items-center" }, [
                        React.createElement('span', { key: 'icon', className: "mr-2" }, "💡"),
                        "质量改进机会"
                    ]),
                    quality_opportunities.length > 0 ? 
                        React.createElement('div', { key: 'list', className: "space-y-3" }, 
                            quality_opportunities.map((product, index) => 
                                React.createElement('div', { key: index, className: "bg-white rounded-lg p-3 border border-yellow-100" }, [
                                    React.createElement('div', { key: 'name', className: "font-medium text-gray-900 text-sm mb-1" }, 
                                        product.productName || '未知产品'
                                    ),
                                    React.createElement('div', { key: 'rating', className: "text-xs text-red-600" }, 
                                        `评分: ${(product.rating || 0).toFixed(1)} ⭐`
                                    )
                                ])
                            )
                        ) : 
                        React.createElement('p', { key: 'empty', className: "text-gray-500 text-sm" }, "暂无质量改进机会")
                ]),
                
                // 新兴趋势词卡片
                React.createElement('div', { key: 'keywords', className: "bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6" }, [
                    React.createElement('h4', { key: 'title', className: "font-bold text-lg text-blue-800 mb-4 flex items-center" }, [
                        React.createElement('span', { key: 'icon', className: "mr-2" }, "🔍"),
                        "新兴趋势词"
                    ]),
                    emerging_keywords.length > 0 ? 
                        React.createElement('div', { key: 'tags', className: "flex flex-wrap gap-2" }, 
                            emerging_keywords.map((keyword, index) => 
                                React.createElement('span', { 
                                    key: index, 
                                    className: "bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full" 
                                }, keyword)
                            )
                        ) : 
                        React.createElement('p', { key: 'empty', className: "text-gray-500 text-sm" }, "暂无新兴趋势词")
                ])
            ]),
            
            // AI战略洞察卡片
            ai_insights ? React.createElement('div', { key: 'ai-insights', className: "mt-6 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6" }, [
                React.createElement('h4', { key: 'title', className: "font-bold text-lg text-purple-800 mb-4 flex items-center" }, [
                    React.createElement('span', { key: 'icon', className: "mr-2" }, "🤖"),
                    "AI战略洞察"
                ]),
                React.createElement('div', { key: 'content', className: "bg-white rounded-lg p-4 border border-purple-100" }, [
                    React.createElement('p', { 
                        key: 'insights', 
                        className: "text-gray-700 leading-relaxed",
                        dangerouslySetInnerHTML: { __html: ai_insights.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/『(.*?)』/g, '<span class="text-purple-700 font-medium">『$1』</span>') }
                    })
                ])
            ]) : null
        ]);
        
    } catch (error) {
        console.error('EmergingTrendsSection - 渲染错误:', error);
        return React.createElement('div', { className: "bg-red-50 border border-red-200 rounded-lg p-4" }, [
            React.createElement('p', { key: 'error', className: "text-red-700" }, `新兴趋势分析组件错误: ${error.message}`)
        ]);
    }
};

const scoringLogic = {
    priceAnalysis: {
        name: "价格稳定性分析",
        criteria: {
            excellent: { min: 12, description: "价格区间分布均匀，存在明显的市场空白，定价策略机会丰富" },
            good: { min: 9, description: "价格分布相对合理，有一定的定价空间和机会" },
            average: { min: 6, description: "价格竞争适中，需要精准定位才能获得优势" },
            poor: { min: 3, description: "价格竞争激烈，利润空间有限" },
            terrible: { min: 0, description: "价格战严重，市场已经饱和" }
        }
    },
    entryBarrierAnalysis: {
        name: "市场进入门槛分析",
        criteria: {
            excellent: { min: 12, description: "进入门槛适中，新卖家有机会但不会过度竞争" },
            good: { min: 9, description: "门槛相对较低，适合有一定经验的卖家进入" },
            average: { min: 6, description: "门槛一般，需要充分准备和差异化策略" },
            poor: { min: 3, description: "门槛较高，需要大量资源投入" },
            terrible: { min: 0, description: "门槛极高，不建议新手进入" }
        }
    },
    qualityAnalysis: {
        name: "质量改进机会分析",
        criteria: {
            excellent: { min: 12, description: "存在明显的质量改进空间，可以通过提升产品质量获得竞争优势" },
            good: { min: 9, description: "有一定的质量提升机会，可以考虑优化产品" },
            average: { min: 6, description: "质量水平一般，需要创新才能脱颖而出" },
            poor: { min: 3, description: "整体质量较高，改进空间有限" },
            terrible: { min: 0, description: "市场质量标准很高，很难通过质量获得优势" }
        }
    },
    competitionAnalysis: {
        name: "竞争强度分析",
        criteria: {
            excellent: { min: 12, description: "竞争强度适中，市场有活力但不过度饱和" },
            good: { min: 9, description: "竞争相对温和，有机会获得市场份额" },
            average: { min: 6, description: "竞争程度一般，需要明确的差异化策略" },
            poor: { min: 3, description: "竞争较为激烈，需要强大的资源支持" },
            terrible: { min: 0, description: "竞争极其激烈，市场已经饱和" }
        }
    }
};

// --- 2. 辅助函数 ---
const getColumnName = (headers, type) => {
    const possibleNames = columnMapping[type] || [];
    for (const name of possibleNames) {
        const found = headers.find(h => h.toLowerCase().includes(name.toLowerCase()));
        if (found) return found;
    }
    return headers[0];
};

const getRecommendation = (score) => {
    if (score >= 12) return { level: 'A', label: '强烈推荐', description: '优秀的市场机会' };
    if (score >= 9) return { level: 'B', label: '推荐', description: '良好的市场潜力' };
    if (score >= 6) return { level: 'C', label: '谨慎考虑', description: '需要详细规划' };
    if (score >= 3) return { level: 'D', label: '不太推荐', description: '风险较高' };
    return { level: 'F', label: '不推荐', description: '市场风险很大' };
};

// --- 3. 核心分析函数 ---
const analyzeAllDimensions = (metrics, products, currencySymbol) => {
    try {
        console.log('analyzeAllDimensions - 开始分析，指标:', metrics);
        
        const priceScore = Math.min(15, Math.max(0, 
            (metrics.avgPrice > 20 ? 4 : 2) + 
            (metrics.productsWithLowReviews > 30 ? 3 : 1) + 
            (metrics.top50AvgPrice > 15 ? 3 : 1) + 
            (metrics.top20AvgPrice / metrics.top50AvgPrice < 2 ? 3 : 1) + 
            (metrics.weakProductsPercentage > 20 ? 2 : 0)
        ));
        
        const entryScore = Math.min(15, Math.max(0,
            (metrics.productsWithLowReviews > 40 ? 4 : metrics.productsWithLowReviews > 20 ? 2 : 0) +
            (metrics.medianReviews < 200 ? 3 : metrics.medianReviews < 500 ? 2 : 1) +
            (metrics.top50AvgSellers < 15 ? 3 : metrics.top50AvgSellers < 25 ? 2 : 1) +
            (metrics.productsWithLowSellersPercentage > 30 ? 3 : 1) +
            (metrics.weakProductsPercentage > 15 ? 2 : 0)
        ));
        
        const qualityScore = Math.min(15, Math.max(0,
            (metrics.weakProductsPercentage > 25 ? 5 : metrics.weakProductsPercentage > 15 ? 3 : 1) +
            (metrics.top50AvgRating < 4.2 ? 4 : metrics.top50AvgRating < 4.4 ? 2 : 1) +
            (metrics.productsWithLowReviews > 35 ? 3 : 1) +
            (metrics.medianReviews < 300 ? 3 : 1)
        ));
        
        const competitionScore = Math.min(15, Math.max(0,
            (metrics.top50AvgSellers < 20 ? 4 : metrics.top50AvgSellers < 30 ? 2 : 0) +
            (metrics.productsWithLowSellersPercentage > 25 ? 3 : 1) +
            (metrics.medianReviews < 400 ? 3 : 1) +
            (metrics.productsWithLowReviews > 30 ? 3 : 1) +
            (metrics.weakProductsPercentage > 20 ? 2 : 0)
        ));

        const getGrade = (score) => {
            if (score >= 12) return 'A';
            if (score >= 9) return 'B';
            if (score >= 6) return 'C';
            if (score >= 3) return 'D';
            return 'F';
        };

        console.log('analyzeAllDimensions - 分析完成，得分:', { priceScore, entryScore, qualityScore, competitionScore });
        
        return {
            price: {
                score: priceScore,
                grade: getGrade(priceScore),
                reasoning: `平均价格${currencySymbol}${metrics.avgPrice.toFixed(2)}，TOP20均价${currencySymbol}${metrics.top20AvgPrice.toFixed(2)}`,
                coreData: [
                    `市场平均价格: ${currencySymbol}${metrics.avgPrice.toFixed(2)}`,
                    `TOP20平均价格: ${currencySymbol}${metrics.top20AvgPrice.toFixed(2)}`,
                    `价格差异倍数: ${(metrics.top20AvgPrice / metrics.top50AvgPrice).toFixed(1)}x`,
                    `低评论产品占比: ${metrics.productsWithLowReviews.toFixed(1)}%`
                ],
                interpretation: "价格分析反映了市场的定价结构和利润空间。较大的价格差异通常意味着存在不同的细分市场和定价策略机会。",
                opportunity: "寻找价格空白区间，通过差异化定价策略获得竞争优势",
                risk: "价格竞争可能导致利润率下降，需要平衡价格与价值",
                actions: [
                    "分析不同价格区间的产品特征和市场表现",
                    "识别价格空白区间的市场机会",
                    "制定基于价值的定价策略",
                    "监控竞争对手的价格变化趋势"
                ],
                criteria: "基于价格分布、利润空间、市场分层等因素综合评估"
            },
            entryBarrier: {
                score: entryScore,
                grade: getGrade(entryScore),
                reasoning: `${metrics.productsWithLowReviews.toFixed(1)}%产品评论少于100，中位数评论${metrics.medianReviews}个`,
                coreData: [
                    `低评论产品占比: ${metrics.productsWithLowReviews.toFixed(1)}%`,
                    `评论数中位数: ${metrics.medianReviews}个`,
                    `平均卖家数: ${metrics.top50AvgSellers.toFixed(1)}个`,
                    `低卖家数产品占比: ${metrics.productsWithLowSellersPercentage.toFixed(1)}%`
                ],
                interpretation: "进入门槛分析评估新卖家进入市场的难易程度。低评论数和少卖家数通常意味着较低的进入门槛。",
                opportunity: "利用较低的进入门槛快速建立市场地位",
                risk: "门槛过低可能导致过度竞争和价格战",
                actions: [
                    "快速积累产品评论和销量",
                    "建立品牌认知度和客户忠诚度",
                    "优化产品listing和关键词策略",
                    "建立供应链和运营优势"
                ],
                criteria: "基于评论门槛、卖家竞争、市场饱和度等因素评估"
            },
            quality: {
                score: qualityScore,
                grade: getGrade(qualityScore),
                reasoning: `${metrics.weakProductsPercentage.toFixed(1)}%产品评分低于4.0，平均评分${metrics.top50AvgRating.toFixed(2)}`,
                coreData: [
                    `低评分产品占比: ${metrics.weakProductsPercentage.toFixed(1)}%`,
                    `市场平均评分: ${metrics.top50AvgRating.toFixed(2)}分`,
                    `评论数中位数: ${metrics.medianReviews}个`,
                    `低评论产品占比: ${metrics.productsWithLowReviews.toFixed(1)}%`
                ],
                interpretation: "质量分析识别通过产品改进获得竞争优势的机会。低评分产品较多表明存在质量提升空间。",
                opportunity: "通过提升产品质量和用户体验获得差异化优势",
                risk: "质量改进需要额外投入，且效果可能需要时间体现",
                actions: [
                    "分析低评分产品的具体问题和改进点",
                    "优化产品设计和制造工艺",
                    "改善客户服务和售后支持",
                    "建立质量控制和反馈机制"
                ],
                criteria: "基于产品评分分布、质量改进空间、用户满意度等评估"
            },
            competition: {
                score: competitionScore,
                grade: getGrade(competitionScore),
                reasoning: `平均${metrics.top50AvgSellers.toFixed(1)}个卖家竞争，${metrics.productsWithLowSellersPercentage.toFixed(1)}%产品卖家数少于10`,
                coreData: [
                    `平均卖家数: ${metrics.top50AvgSellers.toFixed(1)}个`,
                    `低卖家数产品占比: ${metrics.productsWithLowSellersPercentage.toFixed(1)}%`,
                    `评论数中位数: ${metrics.medianReviews}个`,
                    `低评论产品占比: ${metrics.productsWithLowReviews.toFixed(1)}%`
                ],
                interpretation: "竞争强度分析评估市场的竞争激烈程度。适中的竞争有利于市场活力，过度竞争则增加经营难度。",
                opportunity: "在竞争适中的环境中建立稳定的市场地位",
                risk: "竞争加剧可能压缩利润空间和市场份额",
                actions: [
                    "监控主要竞争对手的策略和表现",
                    "建立独特的产品定位和品牌价值",
                    "优化运营效率和成本控制",
                    "寻找竞争较少的细分市场机会"
                ],
                criteria: "基于卖家数量、市场集中度、竞争激烈程度等因素评估"
            }
        };
    } catch (error) {
        console.error('analyzeAllDimensions - 分析错误:', error);
        throw new Error(`维度分析失败: ${error.message}`);
    }
};

const analyzePriceSegments = (products, currencySymbol) => {
    try {
        console.log('analyzePriceSegments - 开始价格分析，产品数量:', products?.length);
        
        if (!products || products.length === 0) {
            return { error: "没有有效的产品数据进行价格分析" };
        }

        const validProducts = products.filter(p => p.price && p.price > 0);
        if (validProducts.length === 0) {
            return { error: "没有有效的价格数据" };
        }

        const prices = validProducts.map(p => p.price).sort((a, b) => a - b);
        const minPrice = prices[0];
        const maxPrice = prices[prices.length - 1];
        const priceRange = maxPrice - minPrice;
        
        const segments = [
            { min: minPrice, max: minPrice + priceRange * 0.25, label: "低价区间" },
            { min: minPrice + priceRange * 0.25, max: minPrice + priceRange * 0.5, label: "中低价区间" },
            { min: minPrice + priceRange * 0.5, max: minPrice + priceRange * 0.75, label: "中高价区间" },
            { min: minPrice + priceRange * 0.75, max: maxPrice, label: "高价区间" }
        ];

        const segmentAnalysis = segments.map(segment => {
            const productsInSegment = validProducts.filter(p => p.price >= segment.min && p.price <= segment.max);
            const count = productsInSegment.length;
            const percentage = ((count / validProducts.length) * 100).toFixed(1) + '%';
            
            let characteristic = "";
            if (count / validProducts.length > 0.4) {
                characteristic = "主要竞争区间";
            } else if (count / validProducts.length > 0.25) {
                characteristic = "活跃竞争区间";
            } else if (count / validProducts.length > 0.1) {
                characteristic = "适度竞争区间";
            } else {
                characteristic = "机会区间";
            }

            return {
                rangeLabel: `${currencySymbol}${segment.min.toFixed(2)} - ${currencySymbol}${segment.max.toFixed(2)}`,
                productCount: count,
                percentage: percentage,
                characteristic: characteristic
            };
        });

        console.log('analyzePriceSegments - 价格分析完成');
        return {
            segments: segmentAnalysis,
            totalProducts: validProducts.length,
            priceRange: { min: minPrice, max: maxPrice }
        };
    } catch (error) {
        console.error('analyzePriceSegments - 价格分析错误:', error);
        return { error: `价格分析失败: ${error.message}` };
    }
};

const analyzeBrandConcentration = (products) => {
    try {
        console.log('analyzeBrandConcentration - 开始品牌分析，产品数量:', products?.length);
        
        if (!products || products.length === 0) {
            return { error: "没有有效的产品数据进行品牌分析" };
        }

        const brandCounts = {};
        products.forEach(product => {
            const brand = product.brand || 'Unknown';
            brandCounts[brand] = (brandCounts[brand] || 0) + 1;
        });

        const brands = Object.entries(brandCounts)
            .map(([brand, count]) => ({ brand, count, percentage: (count / products.length * 100).toFixed(1) }))
            .sort((a, b) => b.count - a.count);

        const totalBrands = brands.length;
        const top4Share = brands.slice(0, 4).reduce((sum, b) => sum + parseFloat(b.percentage), 0);
        const top8Share = brands.slice(0, 8).reduce((sum, b) => sum + parseFloat(b.percentage), 0);
        
        // HHI计算
        const hhi = brands.reduce((sum, brand) => {
            const marketShare = parseFloat(brand.percentage) / 100;
            return sum + (marketShare * marketShare);
        }, 0);
        
        const hhi10000 = Math.round(hhi * 10000);
        
        let marketNature, fragmentation, fragmentationInterpretation;
        
        if (hhi10000 < 1500) {
            marketNature = "高度竞争市场";
            fragmentation = "高度碎片化";
            fragmentationInterpretation = {
                title: "高度碎片化市场分析",
                opportunity: [
                    "市场进入门槛相对较低",
                    "有机会通过差异化快速获得市场份额",
                    "品牌建设投入回报率较高",
                    "可以专注于细分市场需求"
                ],
                challenge: [
                    "竞争者众多，需要强有力的差异化策略",
                    "价格竞争可能较为激烈",
                    "需要持续的营销投入来建立品牌认知",
                    "市场份额增长需要时间积累"
                ]
            };
        } else if (hhi10000 < 2500) {
            marketNature = "适度竞争市场";
            fragmentation = "适度碎片化";
            fragmentationInterpretation = {
                title: "适度碎片化市场分析",
                opportunity: [
                    "市场结构相对稳定，适合长期发展",
                    "有一定的品牌集中度，但仍有成长空间",
                    "可以学习领先品牌的成功经验",
                    "市场教育成本相对较低"
                ],
                challenge: [
                    "需要与已建立的品牌竞争",
                    "差异化策略需要更加精准",
                    "品牌建设需要更多资源投入",
                    "市场份额争夺较为激烈"
                ]
            };
        } else {
            marketNature = "寡头竞争市场";
            fragmentation = "低度碎片化";
            fragmentationInterpretation = {
                title: "低度碎片化市场分析",
                opportunity: [
                    "市场相对成熟，消费者认知度高",
                    "可以通过创新产品打破现有格局",
                    "细分市场可能存在空白机会",
                    "合作或收购可能是进入策略"
                ],
                challenge: [
                    "主导品牌具有强大的市场地位",
                    "进入门槛较高，需要大量资源",
                    "价格竞争空间有限",
                    "品牌建设面临强势竞争对手"
                ]
            };
        }

        const singleProductBrands = brands.filter(b => b.count === 1).length;
        const multiProductBrands = brands.filter(b => b.count > 1).length;
        const avgProductsPerBrand = (products.length / totalBrands).toFixed(1);

        console.log('analyzeBrandConcentration - 品牌分析完成');
        return {
            totalBrands,
            cr4: `${top4Share.toFixed(1)}%`,
            cr8: `${top8Share.toFixed(1)}%`,
            hhi: hhi10000,
            marketNature,
            fragmentation,
            fragmentationInterpretation,
            topBrands: brands.slice(0, 10),
            ecosystem: {
                singleProductBrands,
                multiProductBrands,
                singleProductPercentage: `${(singleProductBrands / totalBrands * 100).toFixed(1)}%`,
                multiProductPercentage: `${(multiProductBrands / totalBrands * 100).toFixed(1)}%`,
                avgProductsPerBrand
            },
            interpretations: {
                hhi: hhi10000 < 1500 ? "高度竞争" : hhi10000 < 2500 ? "适度集中" : "高度集中"
            }
        };
    } catch (error) {
        console.error('analyzeBrandConcentration - 品牌分析错误:', error);
        return { error: `品牌分析失败: ${error.message}` };
    }
};

const generateFinalSummary = ({ scores, brandAnalysis, reviewAnalysis }) => {
    try {
        console.log('generateFinalSummary - 开始生成总结');
        
        const totalScore = (scores.price.score * 0.25) + (scores.entryBarrier.score * 0.20) + (scores.quality.score * 0.30) + (scores.competition.score * 0.25);
        
        let summaryText = `\n🎯 **综合评估得分: ${totalScore.toFixed(1)}/15**\n\n`;
        
        // 核心优势分析
        const sortedScores = Object.entries(scores).sort((a, b) => b[1].score - a[1].score);
        const topStrength = sortedScores[0];
        const mainWeakness = sortedScores[sortedScores.length - 1];
        
        const getAnalysisName = (key) => {
            const names = {
                price: '价格稳定性分析',
                entryBarrier: '市场进入门槛分析', 
                quality: '质量改进机会分析',
                competition: '竞争强度分析'
            };
            return names[key] || `${key}分析`;
        };
        
        summaryText += `🔥 **核心优势**: ${getAnalysisName(topStrength[0])} (${topStrength[1].score}/15)\n`;
        summaryText += `⚠️ **主要挑战**: ${getAnalysisName(mainWeakness[0])} (${mainWeakness[1].score}/15)\n\n`;
        
        // 市场机会评估
        if (totalScore >= 10) {
            summaryText += `✅ **市场机会**: 优秀 - 强烈推荐进入此市场\n`;
            summaryText += `• 多个维度表现优异，市场潜力巨大\n`;
            summaryText += `• 建议制定积极的市场进入策略\n`;
        } else if (totalScore >= 7) {
            summaryText += `🟡 **市场机会**: 良好 - 谨慎乐观，建议进入\n`;
            summaryText += `• 整体条件较好，但需要重点关注薄弱环节\n`;
            summaryText += `• 建议制定针对性的改进策略\n`;
        } else if (totalScore >= 5) {
            summaryText += `🟠 **市场机会**: 一般 - 需要详细规划\n`;
            summaryText += `• 存在一定机会，但风险较高\n`;
            summaryText += `• 建议深入分析并制定风险控制措施\n`;
        } else {
            summaryText += `🔴 **市场机会**: 较低 - 不建议贸然进入\n`;
            summaryText += `• 多个维度存在挑战，风险较高\n`;
            summaryText += `• 建议寻找其他更有潜力的市场机会\n`;
        }
        
        // 品牌竞争格局
        if (brandAnalysis && !brandAnalysis.error) {
            summaryText += `\n🏢 **品牌格局**: ${brandAnalysis.marketNature}\n`;
            summaryText += `• HHI指数: ${brandAnalysis.hhi} (${brandAnalysis.interpretations.hhi})\n`;
            summaryText += `• 市场碎片化程度: ${brandAnalysis.fragmentation}\n`;
        }
        
        // 市场发展阶段
        if (reviewAnalysis && !reviewAnalysis.error) {
            summaryText += `\n📈 **市场阶段**: ${reviewAnalysis.marketStatus.text}\n`;
            summaryText += `• 分析时间范围: ${reviewAnalysis.timeRange}\n`;
        }
        
        // 战略建议
        summaryText += `\n🎯 **核心战略建议**:\n`;
        
        if (scores.price.score >= 8) {
            summaryText += `• 💰 利用价格优势，制定有竞争力的定价策略\n`;
        }
        if (scores.entryBarrier.score >= 8) {
            summaryText += `• 🚀 抓住较低进入门槛，快速建立市场地位\n`;
        }
        if (scores.quality.score >= 8) {
            summaryText += `• ⭐ 通过质量改进获得差异化竞争优势\n`;
        }
        if (scores.competition.score >= 8) {
            summaryText += `• 🎯 在适度竞争环境中稳步发展\n`;
        }
        
        // 风险提醒
        const lowScores = Object.entries(scores).filter(([_, data]) => data.score < 6);
        if (lowScores.length > 0) {
            summaryText += `\n⚠️ **重点关注风险**:\n`;
            lowScores.forEach(([key, data]) => {
                summaryText += `• ${getAnalysisName(key)}: ${data.risk}\n`;
            });
        }
        
        summaryText += `\n\n总体而言，市场机会丰富，竞争正在加速但尚未固化，适合具备快速反应和差异化能力的卖家进入。`;
        
        console.log('generateFinalSummary - 总结生成完成');
        return summaryText;
    } catch (error) {
        console.error('generateFinalSummary - 总结生成错误:', error);
        return `总结生成失败: ${error.message}`;
    }
};

// --- 4. 所有UI组件 ---
const CollapsibleSection = ({ title, titleClassName, children, defaultOpen = false }) => {
    try {
        const [isOpen, setIsOpen] = React.useState(defaultOpen);
        return React.createElement('div', { className: "bg-white rounded-lg border p-6 mb-8 shadow-sm" }, [
            React.createElement('div', { key: 'header', className: "flex items-center justify-between cursor-pointer -my-2 -mx-2 py-2 px-2 rounded-md hover:bg-gray-100", onClick: () => setIsOpen(!isOpen) }, [
                React.createElement('h3', { key: 'title', className: titleClassName || "text-xl font-bold text-gray-900 flex items-center" }, title),
                React.createElement('span', { key: 'icon', className: `text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}` }, "▼")
            ]),
            isOpen && React.createElement('div', { key: 'content', className: "mt-4 border-t pt-4" }, children)
        ]);
    } catch (error) {
        console.error('CollapsibleSection - 渲染错误:', error);
        return React.createElement('div', { className: "bg-red-50 border border-red-200 rounded-lg p-4" }, [
            React.createElement('p', { className: "text-red-700" }, `可折叠组件渲染失败: ${error.message}`)
        ]);
    }
};

const DetailedAnalysisSection = ({ analysis }) => {
    try {
        console.log('DetailedAnalysisSection - 渲染开始，分析数据:', analysis);
        
        if (!analysis || !analysis.scores) {
            console.warn('DetailedAnalysisSection - 分析数据不完整');
            return React.createElement('div', { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-4" }, [
                React.createElement('p', { className: "text-yellow-700" }, "详细分析数据不可用")
            ]);
        }
        
        const [isExpanded, setIsExpanded] = React.useState(false);
        const { scores } = analysis;
        const dimensions = [ 
            { key: 'price', title: '价格稳定性分析', icon: '📈', color: 'green' }, 
            { key: 'entryBarrier', title: '市场进入门槛分析', icon: '👥', color: 'blue' }, 
            { key: 'quality', title: '质量改进机会分析', icon: '⭐', color: 'green' }, 
            { key: 'competition', title: '竞争强度分析', icon: '🎯', color: 'green' }
        ];
        
        const renderList = (items) => React.createElement('ul', { className: "space-y-1" }, items.map((item, i) => React.createElement('li', { key: i }, `• ${item}`)));
        
        console.log('DetailedAnalysisSection - 渲染成功');
        return React.createElement('div', { className: "bg-white rounded-lg border p-6 mb-8 shadow-sm" }, [
            React.createElement('div', { key: 'summary-cards', className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" }, 
                dimensions.map(dim => React.createElement('div', { key: dim.key, className: "border rounded-lg p-4" }, [ 
                    React.createElement('div', { key: 'header', className: "flex justify-between items-start" }, [ 
                        React.createElement('div', { key: 'title-section', className: "flex items-center space-x-2" }, [ 
                            React.createElement('span', { key: 'icon', className: `text-${dim.color}-500` }, dim.icon), 
                            React.createElement('h4', { key: 'title', className: "font-semibold text-gray-800" }, dim.title) 
                        ]), 
                        React.createElement('div', { key: 'score', className: `px-3 py-1 rounded-full text-white font-bold text-sm bg-${dim.color}-500` }, `${scores[dim.key].score}/15 等级 ${scores[dim.key].grade}`) 
                    ]), 
                    React.createElement('p', { key: 'reasoning', className: "text-sm text-gray-600 mt-2" }, scores[dim.key].reasoning) 
                ])
            )),
            React.createElement('div', { key: 'toggle-button', className: "text-center border-t pt-4" }, [ 
                React.createElement('button', { key: 'button', onClick: () => setIsExpanded(!isExpanded), className: "text-blue-600 font-semibold hover:underline flex items-center justify-center mx-auto" }, [ 
                    isExpanded ? "收起详细分析" : "展开详细分析", 
                    React.createElement('span', { key: 'chevron', className: `ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}` }, "▼") 
                ]) 
            ]),
            isExpanded && React.createElement('div', { key: 'details-table', className: "overflow-x-auto mt-6" }, [ 
                React.createElement('table', { key: 'table', className: "w-full text-sm border-collapse" }, [ 
                    React.createElement('thead', { key: 'thead' }, [ 
                        React.createElement('tr', { key: 'header-row' }, [ 
                            React.createElement('th', { key: 'dimension-header', className: "w-1/6 px-3 py-2 text-left font-semibold text-gray-700 bg-gray-100 border" }, "分析维度"), 
                            ...dimensions.map(dim => React.createElement('th', { key: dim.key, className: "w-1/4 px-3 py-2 text-left font-semibold text-gray-700 bg-gray-100 border" }, [ 
                                React.createElement('span', { key: 'icon', className: `mr-2 inline-block text-${dim.color}-500` }, dim.icon), 
                                dim.title 
                            ])) 
                        ]) 
                    ]), 
                    React.createElement('tbody', { key: 'tbody' }, 
                        [['核心数据', 'coreData'], ['含义解释', 'interpretation'], ['机会与风险', 'opportunityRisk'], ['行动建议', 'actions'], ['评分标准', 'criteria'], ['最终评分', 'scoreGrade']].map(row => 
                            React.createElement('tr', { key: row[0], className: "border-t" }, [ 
                                React.createElement('td', { key: 'row-header', className: "px-3 py-2 border font-bold bg-gray-50 align-top" }, row[0]), 
                                ...dimensions.map(dim => React.createElement('td', { key: dim.key, className: "px-3 py-2 border align-top text-xs" }, 
                                    row[1] === 'coreData' ? renderList(scores[dim.key].coreData) : 
                                    row[1] === 'opportunityRisk' ? React.createElement('div', { key: 'opportunity-risk' }, [ 
                                        React.createElement('p', { key: 'opportunity' }, [ 
                                            React.createElement('strong', { key: 'opp-label', className: "text-green-600" }, "机会: "), 
                                            scores[dim.key].opportunity 
                                        ]), 
                                        React.createElement('p', { key: 'risk', className: "mt-1" }, [ 
                                            React.createElement('strong', { key: 'risk-label', className: "text-red-600" }, "风险: "), 
                                            scores[dim.key].risk 
                                        ]) 
                                    ]) : 
                                    row[1] === 'actions' ? renderList(scores[dim.key].actions) : 
                                    row[1] === 'scoreGrade' ? React.createElement('p', { key: 'score-grade', className: `font-bold text-${scores[dim.key].grade === 'A' || scores[dim.key].grade === 'B' ? 'green' : 'orange'}-600`}, `${scores[dim.key].score}/15 (${scores[dim.key].grade}级)`) : 
                                    React.createElement('p', { key: 'other' }, scores[dim.key][row[1]])
                                )) 
                            ])
                        )
                    ) 
                ]) 
            ])
        ]);
    } catch (error) {
        console.error('DetailedAnalysisSection - 渲染错误:', error);
        return React.createElement('div', { className: "bg-red-50 border border-red-200 rounded-lg p-4" }, [
            React.createElement('p', { className: "text-red-700" }, `详细分析组件渲染失败: ${error.message}`)
        ]);
    }
};

const PriceAnalysisSection = ({ priceAnalysis, currencySymbol }) => {
    try {
        console.log('PriceAnalysisSection - 渲染开始，价格分析数据:', priceAnalysis);
        
        if (priceAnalysis.error) {
            console.warn('PriceAnalysisSection - 价格分析数据错误:', priceAnalysis.error);
            return React.createElement('div', { className: "bg-white rounded-lg border p-6 mb-8 shadow-sm" }, [
                React.createElement('h3', { key: 'title', className: "text-xl font-bold text-gray-900 mb-4 flex items-center" }, [
                    React.createElement('span', { key: 'icon', className: "mr-2 text-green-500" }, "💰"),
                    "价格区间机会分析"
                ]),
                React.createElement('div', { key: 'error', className: "text-red-600 bg-red-50 p-4 rounded-lg" }, priceAnalysis.error)
            ]);
        }

        console.log('PriceAnalysisSection - 渲染成功');
        return React.createElement(CollapsibleSection, {
            title: React.createElement('div', { className: "flex items-center" }, [
                React.createElement('span', { key: 'icon', className: "mr-2 text-green-500" }, "💰"),
                "价格区间机会分析"
            ]),
            defaultOpen: true
        }, [
            React.createElement('div', { key: 'content', className: "space-y-6" }, [
                React.createElement('div', { key: 'table-container', className: "overflow-x-auto" }, [
                    React.createElement('table', { key: 'table', className: "w-full text-sm border-collapse border" }, [
                        React.createElement('thead', { key: 'thead' }, [
                            React.createElement('tr', { key: 'header-row', className: "bg-gray-100" }, [
                                React.createElement('th', { key: 'range', className: "border px-4 py-2 text-left font-semibold" }, "价格区间"),
                                React.createElement('th', { key: 'characteristic', className: "border px-4 py-2 text-left font-semibold" }, "区间特征"),
                                React.createElement('th', { key: 'count', className: "border px-4 py-2 text-left font-semibold" }, "产品数量"),
                                React.createElement('th', { key: 'percentage', className: "border px-4 py-2 text-left font-semibold" }, "市场占比")
                            ])
                        ]),
                        React.createElement('tbody', { key: 'tbody' }, priceAnalysis.segments.map((segment, index) => 
                            React.createElement('tr', { key: index, className: "hover:bg-gray-50" }, [
                                React.createElement('td', { key: 'range', className: "border px-4 py-2 font-mono" }, segment.rangeLabel),
                                React.createElement('td', { key: 'characteristic', className: "border px-4 py-2" }, segment.characteristic),
                                React.createElement('td', { key: 'count', className: "border px-4 py-2 text-center" }, segment.productCount),
                                React.createElement('td', { key: 'percentage', className: "border px-4 py-2 text-center" }, segment.percentage)
                            ])
                        ))
                    ])
                ]),
                React.createElement('div', { key: 'strategy', className: "bg-purple-50 p-4 rounded-lg" }, [
                    React.createElement('h4', { key: 'title', className: "font-semibold text-purple-900 mb-3 flex items-center" }, [
                        React.createElement('span', { key: 'icon', className: "mr-2" }, "🤖"),
                        "AI价格策略洞察"
                    ]),
                    React.createElement('div', { key: 'insights', className: "text-purple-800 space-y-2" }, 
                        (priceAnalysis.strategic_insights && priceAnalysis.strategic_insights.length > 0) ?
                            priceAnalysis.strategic_insights.map((insight, index) => 
                                React.createElement('div', { 
                                    key: index, 
                                    className: "p-3 bg-white rounded border-l-4 border-purple-400",
                                    dangerouslySetInnerHTML: { 
                                        __html: insight.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                                    }
                                })
                            ) :
                            [
                                React.createElement('div', { key: 'default1', className: "p-3 bg-white rounded border-l-4 border-purple-400" }, "• 关注产品数量较少但市场占比合理的价格区间"),
                                React.createElement('div', { key: 'default2', className: "p-3 bg-white rounded border-l-4 border-purple-400" }, "• 避开过度竞争的主流价格区间"),
                                React.createElement('div', { key: 'default3', className: "p-3 bg-white rounded border-l-4 border-purple-400" }, "• 考虑在高端区间通过质量差异化获得更高利润")
                            ]
                    )
                ])
            ])
        ]);
    } catch (error) {
        console.error('PriceAnalysisSection - 渲染错误:', error);
        return React.createElement('div', { className: "bg-red-50 border border-red-200 rounded-lg p-4" }, [
            React.createElement('p', { className: "text-red-700" }, `价格分析组件渲染失败: ${error.message}`)
        ]);
    }
};

const BrandConcentrationSection = ({ brandAnalysis, brandInsights }) => {
    try {
        console.log('BrandConcentrationSection - 渲染开始，品牌分析数据:', brandAnalysis);
        
        if (brandAnalysis.error) {
            console.warn('BrandConcentrationSection - 品牌分析数据错误:', brandAnalysis.error);
            return React.createElement('div', { className: "bg-white rounded-lg border p-6 mb-8 shadow-sm" }, [
                React.createElement('h3', { key: 'title', className: "text-xl font-bold text-gray-900 mb-4 flex items-center" }, [
                    React.createElement('span', { key: 'icon', className: "mr-2 text-purple-500" }, "🏢"),
                    "品牌集中度分析"
                ]),
                React.createElement('div', { key: 'error', className: "text-red-600 bg-red-50 p-4 rounded-lg" }, brandAnalysis.error)
            ]);
        }

        console.log('BrandConcentrationSection - 渲染成功');
        return React.createElement(CollapsibleSection, {
            title: React.createElement('div', { className: "flex items-center" }, [
                React.createElement('span', { key: 'icon', className: "mr-2 text-purple-500" }, "🏢"),
                "品牌集中度分析"
            ]),
            defaultOpen: true
        }, [
            React.createElement('div', { key: 'content', className: "space-y-6" }, [
                React.createElement('div', { key: 'overview', className: "grid grid-cols-1 md:grid-cols-3 gap-4" }, [
                    React.createElement('div', { key: 'nature', className: "bg-blue-50 p-4 rounded-lg" }, [
                        React.createElement('h4', { key: 'title', className: "font-semibold text-blue-900 mb-2" }, "市场性质"),
                        React.createElement('p', { key: 'value', className: "text-blue-800" }, brandAnalysis.marketNature)
                    ]),
                    React.createElement('div', { key: 'hhi', className: "bg-green-50 p-4 rounded-lg" }, [
                        React.createElement('h4', { key: 'title', className: "font-semibold text-green-900 mb-2" }, "HHI指数"),
                        React.createElement('p', { key: 'value', className: "text-green-800 font-mono" }, brandAnalysis.hhi),
                        React.createElement('p', { key: 'interpretation', className: "text-xs text-green-600 mt-1" }, brandAnalysis.interpretations.hhi)
                    ]),
                    React.createElement('div', { key: 'fragmentation', className: "bg-yellow-50 p-4 rounded-lg" }, [
                        React.createElement('h4', { key: 'title', className: "font-semibold text-yellow-900 mb-2" }, "市场碎片化"),
                        React.createElement('p', { key: 'value', className: "text-yellow-800" }, brandAnalysis.fragmentation)
                    ])
                ]),
                React.createElement('div', { key: 'concentration', className: "bg-gray-50 p-4 rounded-lg" }, [
                    React.createElement('h4', { key: 'title', className: "font-semibold text-gray-900 mb-3" }, "市场集中度分析"),
                    React.createElement('div', { key: 'metrics', className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-center" }, [
                        React.createElement('div', { key: 'cr4' }, [
                            React.createElement('p', { key: 'label', className: "text-sm text-gray-600" }, "CR4集中度"),
                            React.createElement('p', { key: 'value', className: "text-lg font-bold text-gray-900" }, brandAnalysis.cr4)
                        ]),
                        React.createElement('div', { key: 'cr8' }, [
                            React.createElement('p', { key: 'label', className: "text-sm text-gray-600" }, "CR8集中度"),
                            React.createElement('p', { key: 'value', className: "text-lg font-bold text-gray-900" }, brandAnalysis.cr8)
                        ]),
                        React.createElement('div', { key: 'brands' }, [
                            React.createElement('p', { key: 'label', className: "text-sm text-gray-600" }, "总品牌数"),
                            React.createElement('p', { key: 'value', className: "text-lg font-bold text-gray-900" }, brandAnalysis.totalBrands)
                        ]),
                        React.createElement('div', { key: 'avg' }, [
                             React.createElement('p', { key: 'label', className: "text-sm text-gray-600" }, "平均产品数"),
                             React.createElement('p', { key: 'value', className: "text-lg font-bold text-gray-900" }, brandAnalysis.ecosystem.avgProductsPerBrand)
                         ])
                     ])
                 ]),
                 React.createElement('div', { key: 'top-brands', className: "overflow-x-auto" }, [
                     React.createElement('h4', { key: 'title', className: "font-semibold text-gray-900 mb-3" }, "主要品牌分布"),
                     React.createElement('table', { key: 'table', className: "w-full text-sm border-collapse border" }, [
                         React.createElement('thead', { key: 'thead' }, [
                             React.createElement('tr', { key: 'header-row', className: "bg-gray-100" }, [
                                 React.createElement('th', { key: 'rank', className: "border px-4 py-2 text-left font-semibold" }, "排名"),
                                 React.createElement('th', { key: 'brand', className: "border px-4 py-2 text-left font-semibold" }, "品牌名称"),
                                 React.createElement('th', { key: 'count', className: "border px-4 py-2 text-left font-semibold" }, "产品数量"),
                                 React.createElement('th', { key: 'share', className: "border px-4 py-2 text-left font-semibold" }, "市场份额")
                             ])
                         ]),
                         React.createElement('tbody', { key: 'tbody' }, brandAnalysis.topBrands.map((brand, index) => 
                             React.createElement('tr', { key: index, className: "hover:bg-gray-50" }, [
                                 React.createElement('td', { key: 'rank', className: "border px-4 py-2 text-center" }, index + 1),
                                 React.createElement('td', { key: 'brand', className: "border px-4 py-2" }, brand.brand),
                                 React.createElement('td', { key: 'count', className: "border px-4 py-2 text-center" }, brand.count),
                                 React.createElement('td', { key: 'share', className: "border px-4 py-2 text-center" }, brand.percentage.toFixed(1) + '%')
                             ])
                         ))
                     ])
                 ]),
                 brandAnalysis.fragmentationInterpretation && React.createElement('div', { key: 'interpretation', className: "bg-yellow-50 p-4 rounded-lg" }, [
                     React.createElement('h4', { key: 'title', className: "font-semibold text-yellow-900 mb-3" }, brandAnalysis.fragmentationInterpretation.title),
                     React.createElement('div', { key: 'content', className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                         React.createElement('div', { key: 'opportunities' }, [
                             React.createElement('h5', { key: 'title', className: "font-semibold text-green-700 mb-2" }, "机会"),
                             React.createElement('ul', { key: 'list', className: "text-green-600 space-y-1" }, brandAnalysis.fragmentationInterpretation.opportunity.map((item, i) => 
                                 React.createElement('li', { key: i }, `• ${item}`)
                             ))
                         ]),
                         React.createElement('div', { key: 'challenges' }, [
                             React.createElement('h5', { key: 'title', className: "font-semibold text-red-700 mb-2" }, "挑战"),
                             React.createElement('ul', { key: 'list', className: "text-red-600 space-y-1" }, brandAnalysis.fragmentationInterpretation.challenge.map((item, i) => 
                                 React.createElement('li', { key: i }, `• ${item}`)
                             ))
                         ])
                     ])
                 ]),
                 // AI品牌战略洞察区域
                 brandInsights && React.createElement('div', { key: 'ai-insights', className: "bg-purple-50 p-4 rounded-lg border border-purple-200" }, [
                     React.createElement('h4', { key: 'title', className: "font-semibold text-purple-900 mb-3 flex items-center" }, [
                         React.createElement('span', { key: 'icon', className: "mr-2" }, "🧠"),
                         "AI品牌战略洞察"
                     ]),
                     React.createElement('div', { key: 'content', className: "text-purple-800 leading-relaxed" }, 
                         brandInsights.split('**').map((part, index) => {
                             if (index % 2 === 1) {
                                 return React.createElement('strong', { key: index }, part);
                             }
                             return part;
                         })
                     )
                 ])
             ])
         ]);
     } catch (error) {
         console.error('BrandConcentrationSection - 渲染错误:', error);
         return React.createElement('div', { className: "bg-red-50 border border-red-200 rounded-lg p-4" }, [
             React.createElement('p', { className: "text-red-700" }, `品牌集中度分析组件渲染失败: ${error.message}`)
         ]);
     }
 };

 // analyzeNiche函数已移除，现在使用后端API提供的reviewAnalysis数据

 const analyzeBSRTiers = (products, currencySymbol) => {
     if (!products || products.length === 0) {
         return null;
     }

     const validProducts = products.filter(p => p.rank && p.rank > 0);
     if (validProducts.length === 0) {
         return null;
     }

     const tiers = [
         { name: "顶级竞争者", min: 1, max: 100, icon: "👑", grade: "S" },
         { name: "强势竞争者", min: 101, max: 1000, icon: "🥇", grade: "A" },
         { name: "主流竞争者", min: 1001, max: 10000, icon: "🥈", grade: "B" },
         { name: "一般竞争者", min: 10001, max: 100000, icon: "🥉", grade: "C" },
         { name: "边缘竞争者", min: 100001, max: Infinity, icon: "📦", grade: "D" }
     ];

     const tierAnalysis = tiers.map(tier => {
         const competitorsInTier = validProducts.filter(p => p.rank >= tier.min && p.rank <= tier.max);
         const competitorCount = competitorsInTier.length;
         const totalMarketShare = `${(competitorCount / validProducts.length * 100).toFixed(1)}%`;
         
         const avgPrice = competitorCount > 0 
             ? `${currencySymbol}${(competitorsInTier.reduce((sum, p) => sum + p.price, 0) / competitorCount).toFixed(2)}`
             : 'N/A';
         
         const bsrRange = tier.max === Infinity 
             ? `${tier.min.toLocaleString()}+`
             : `${tier.min.toLocaleString()} - ${tier.max.toLocaleString()}`;
         
         const characteristics = [];
         if (tier.grade === 'S') {
             characteristics.push("市场领导者，品牌影响力强");
             characteristics.push("销量稳定，客户忠诚度高");
             characteristics.push("定价权强，利润率较高");
         } else if (tier.grade === 'A') {
             characteristics.push("强势品牌，市场地位稳固");
             characteristics.push("销量表现优秀，增长潜力大");
             characteristics.push("竞争激烈，需要持续创新");
         } else if (tier.grade === 'B') {
             characteristics.push("主流市场参与者");
             characteristics.push("销量稳定，但面临竞争压力");
             characteristics.push("需要差异化策略突破");
         } else if (tier.grade === 'C') {
             characteristics.push("市场跟随者");
             characteristics.push("销量一般，增长空间有限");
             characteristics.push("价格敏感，利润率较低");
         } else {
             characteristics.push("边缘参与者");
             characteristics.push("销量较低，市场影响力小");
             characteristics.push("需要重新定位或退出考虑");
         }
         
         return {
             ...tier,
             competitorCount,
             totalMarketShare,
             avgPrice,
             bsrRange,
             characteristics
         };
     }).filter(tier => tier.competitorCount > 0);

     return { tierAnalysis };
 };

 const analyzeAttackMatrix = (scores) => {
     const dimensions = ['price', 'entryBarrier', 'quality', 'competition'];
     const matrix = [];
     
     dimensions.forEach(dim1 => {
         dimensions.forEach(dim2 => {
             if (dim1 !== dim2) {
                 const score1 = scores[dim1].score;
                 const score2 = scores[dim2].score;
                 const combinedScore = (score1 + score2) / 2;
                 
                 let strategy = '';
                 let icon = '';
                 
                 if (dim1 === 'price' && dim2 === 'quality') {
                     strategy = '价值定位策略';
                     icon = '💎';
                 } else if (dim1 === 'entryBarrier' && dim2 === 'competition') {
                     strategy = '快速进入策略';
                     icon = '⚡';
                 } else if (dim1 === 'quality' && dim2 === 'competition') {
                     strategy = '差异化策略';
                     icon = '🎯';
                 } else {
                     strategy = '综合策略';
                     icon = '🔄';
                 }
                 
                 matrix.push({
                     dimension1: dim1,
                     dimension2: dim2,
                     combinedScore,
                     strategy,
                     icon,
                     feasibility: combinedScore >= 8 ? '高' : combinedScore >= 5 ? '中' : '低'
                 });
             }
         });
     });
     
     return matrix.sort((a, b) => b.combinedScore - a.combinedScore);
 };

 const analyzeNiche = (products, currencySymbol, backendReviewAnalysis = null) => {
     const sortedByRank = [...products].sort((a, b) => a.rank - b.rank);
     const top50 = sortedByRank.slice(0, Math.min(50, products.length));
     const top20 = top50.slice(0, 20);
     const reviews = top50.map(p => p.reviews).sort((a, b) => a - b);
     const mid = Math.floor(reviews.length / 2);
     const medianReviews = reviews.length % 2 === 0 ? (reviews[mid-1] + reviews[mid]) / 2 : reviews[mid];
     const metrics = {
         totalProducts: products.length,
         avgPrice: top50.reduce((sum, p) => sum + p.price, 0) / top50.length,
         top20AvgPrice: top20.length > 0 ? top20.reduce((sum, p) => sum + p.price, 0) / top20.length : 0,
         top50AvgPrice: top50.length > 0 ? top50.reduce((sum, p) => sum + p.price, 0) / top50.length : 0,
         top50AvgReviews: top50.reduce((sum, p) => sum + p.reviews, 0) / top50.length,
         productsWithLowReviews: (top50.filter(p => p.reviews < 100).length / top50.length * 100),
         medianReviews,
         top50AvgRating: top50.reduce((sum, p) => sum + p.rating, 0) / top50.length,
         weakProducts: top50.filter(p => p.rating < 4.0).length,
         weakProductsPercentage: (top50.filter(p => p.rating < 4.0).length / top50.length * 100),
         top50AvgSellers: top50.reduce((sum, p) => sum + p.sellers, 0) / top50.length,
         productsWithLowSellersPercentage: (top50.filter(p => p.sellers < 10).length / top50.length * 100),
     };
     const detailedScores = analyzeAllDimensions(metrics, products, currencySymbol);
     const totalScore = (detailedScores.price.score * 0.25) + (detailedScores.entryBarrier.score * 0.20) + (detailedScores.quality.score * 0.30) + (detailedScores.competition.score * 0.25);
     
     // 使用后端提供的reviewAnalysis，如果没有则使用默认值
     const reviewAnalysis = backendReviewAnalysis || { error: "评论时间分析数据不可用" };
     const brandAnalysis = analyzeBrandConcentration(products);
     
     return { 
         metrics, 
         scores: detailedScores, 
         totalScore, 
         currencySymbol, 
         recommendation: getRecommendation(totalScore), 
         priceAnalysis: analyzePriceSegments(products, currencySymbol), 
         brandAnalysis: brandAnalysis, 
         reviewAnalysis: reviewAnalysis, 
         bsrAnalysis: analyzeBSRTiers(products, currencySymbol), 
         attackMatrix: analyzeAttackMatrix(detailedScores), 
         finalSummary: generateFinalSummary({ scores: detailedScores, brandAnalysis: brandAnalysis, reviewAnalysis: reviewAnalysis }) 
     };
 };

 // --- 主应用组件 ---
// BackToTopButton 组件
const BackToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    // 滚动监听逻辑
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    // 滚动到顶部函数
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return isVisible ? React.createElement('button', {
        onClick: scrollToTop,
        className: "fixed bottom-5 right-5 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-50",
        'aria-label': "返回顶部",
        title: "返回顶部"
    }, [
        React.createElement('svg', {
            key: 'arrow-icon',
            className: "w-6 h-6",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            xmlns: "http://www.w3.org/2000/svg"
        }, [
            React.createElement('path', {
                key: 'arrow-path',
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M5 10l7-7m0 0l7 7m-7-7v18"
            })
        ])
    ]) : null;
};

 const App = () => {
     const [csvData, setCsvData] = useState(null);
     const [analysis, setAnalysis] = useState(null);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState(null);
     const [currencySymbol, setCurrencySymbol] = useState('$');

     const handleFileUpload = useCallback(async (event) => {
         const file = event.target.files[0];
         if (!file) return;

         setLoading(true);
         setError(null);
         setAnalysis(null);

         try {
             console.log('handleFileUpload - 开始处理文件:', file.name);
             
             // 向后端发送文件进行完整分析
             const formData = new FormData();
             formData.append('file', file);

             const response = await fetch('/analyze', {
                 method: 'POST',
                 body: formData
             });

             if (!response.ok) {
                 throw new Error(`服务器错误: ${response.status}`);
             }

             const backendResult = await response.json();
             console.log('handleFileUpload - 后端响应:', backendResult);
             
             if (backendResult.error) {
                 throw new Error(backendResult.error);
             }

             // 前端现在只是一个纯粹的数据展示者
             // 直接使用后端返回的完整分析结果
             setCurrencySymbol(backendResult.currencySymbol || '$');
             setCsvData(backendResult.products || []);
             // 后端直接返回分析结果，不是包装在analysis字段中
             setAnalysis(backendResult);
             
             console.log('handleFileUpload - 文件处理完成');
         } catch (err) {
             console.error('handleFileUpload - 文件处理错误:', err);
             setError(`文件处理失败: ${err.message}`);
         } finally {
             setLoading(false);
         }
     }, []);

     const generateOverallAssessment = (analysis) => {
         try {
             const { scores } = analysis;
             const opportunities = [];
             if (scores.price.grade <= 'B') opportunities.push("价格稳定无战争风险");
             if (scores.quality.grade <= 'B') opportunities.push("质量改进空间巨大");
             if (scores.entryBarrier.grade <= 'B') opportunities.push("市场进入门槛适中");
             if (scores.competition.grade <= 'B') opportunities.push("利润保护极佳");
             const primaryOpportunity = opportunities.slice(0, 2).join("，");
             let strategy = "建议策略：";
             const strategies = [];
             if (scores.quality.grade <= 'B') strategies.push("质量差异化");
             if (scores.price.grade <= 'B') strategies.push("稳健进入");
             if (strategies.length === 0) strategies.push("谨慎评估");
             strategy += strategies.join(" + ");
             return {
                 title: `市场呈现优质机会特征: ${primaryOpportunity}。`,
                 strategy: strategy
             };
         } catch (error) {
             console.error('generateOverallAssessment - 评估生成错误:', error);
             return {
                 title: "市场评估数据处理中出现错误",
                 strategy: "建议重新分析数据"
             };
         }
     };

     return React.createElement(ErrorBoundary, {}, [
         React.createElement('div', { key: 'app', className: "min-h-screen bg-gray-50 py-8" }, [
             React.createElement(BackToTopButton, { key: 'back-to-top' }),
             React.createElement('div', { key: 'container', className: "max-w-7xl mx-auto px-4" }, [
                 React.createElement('div', { key: 'header', className: "text-center mb-12" }, [
                    React.createElement('h1', { key: 'title', className: "text-4xl font-bold text-gray-900 mb-4" }, "Amazon 利基市场分析器"),
                    React.createElement('p', { key: 'subtitle', className: "text-xl text-gray-600 max-w-3xl mx-auto" }, "上传您的产品数据CSV文件，获得专业的市场机会分析报告")
                ]),
                 React.createElement('div', { key: 'instruction-container', className: "text-center mb-6" }, [
                     React.createElement('a', {
                         key: 'instruction-button',
                         href: 'instructions.html',
                         target: '_blank',
                         className: "inline-flex items-center px-4 py-2 text-red-600 font-medium border border-red-300 rounded-lg hover:bg-red-50 hover:border-red-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                     }, "【导入CSV前必看】")
                 ]),
                 React.createElement('div', { key: 'upload-section', className: "bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center mb-8 hover:border-blue-400 transition-colors flex flex-col" }, [
                     React.createElement('div', { key: 'upload-content', className: "space-y-4" }, [
                         React.createElement('div', { key: 'icon', className: "mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center" }, [
                             React.createElement('span', { key: 'upload-icon', className: "text-2xl text-blue-600" }, "📊")
                         ]),
                         React.createElement('div', { key: 'text' }, [
                             React.createElement('h3', { key: 'title', className: "text-lg font-semibold text-gray-900 mb-2" }, "上传CSV数据文件"),
                             React.createElement('p', { key: 'description', className: "text-gray-600" }, "支持包含产品名称、价格、BSR、评论数等字段的CSV文件")
                         ]),
                         React.createElement('input', {
                             key: 'file-input',
                             type: 'file',
                             accept: '.csv',
                             onChange: handleFileUpload,
                             className: "block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                         })
                     ]),
                     React.createElement('a', {
                         key: 'glossary-button',
                         href: 'glossary.html',
                         target: '_blank',
                         className: "inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-auto ml-auto"
                     }, "❓ 指标解释")
                 ]),
                 loading && React.createElement('div', { key: 'loading', className: "text-center py-12" }, [
                     React.createElement('div', { key: 'spinner', className: "inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4" }),
                     React.createElement('p', { key: 'text', className: "text-gray-600" }, "正在分析数据，请稍候...")
                 ]),
                 error && React.createElement('div', { key: 'error', className: "bg-red-50 border border-red-200 rounded-lg p-4 mb-8" }, [
                     React.createElement('div', { key: 'content', className: "flex items-center" }, [
                         React.createElement('span', { key: 'icon', className: "text-red-500 mr-3" }, "⚠️"),
                         React.createElement('p', { key: 'message', className: "text-red-700" }, error)
                     ])
                 ]),
                 analysis && React.createElement(ErrorBoundary, { key: 'analysis-boundary' }, [
                     React.createElement('div', { key: 'analysis-results', className: "space-y-8" }, [
                         React.createElement('div', { key: 'overall-assessment', className: "bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white shadow-lg" }, [
                             React.createElement('h2', { key: 'title', className: "text-3xl font-bold mb-2" }, "综合市场机会评估"),
                             React.createElement('p', { key: 'assessment', className: "text-lg text-blue-200 mb-4" }, 
                                 analysis.finalSummary && analysis.finalSummary.opportunity_text ? 
                                     analysis.finalSummary.opportunity_text : 
                                     generateOverallAssessment(analysis).title
                             ),
                             React.createElement('p', { key: 'strategy', className: "text-lg text-blue-200 mb-6" }, 
                                 analysis.finalSummary && analysis.finalSummary.strategy_text ? 
                                     analysis.finalSummary.strategy_text : 
                                     generateOverallAssessment(analysis).strategy
                             ),
                             React.createElement('div', { key: 'scores', className: "flex flex-wrap gap-4" },
                                 Object.entries(analysis.scores).map(([key, scoreData]) => {
                                     const analysisKey = key + 'Analysis';
                                     const scoringData = scoringLogic[analysisKey];
                                     return React.createElement('div', { key: key, className: "bg-white bg-opacity-10 backdrop-blur-sm rounded-lg px-4 py-2 text-center" }, [
                                         React.createElement('p', { key: 'name', className: "text-sm text-blue-200" }, scoringData ? scoringData.name : `${key}分析`),
                                         React.createElement('p', { key: 'grade', className: "font-bold text-xl" }, `等级 ${scoreData.grade}`)
                                     ]);
                                 })
                             )
                         ]),
                         React.createElement(ErrorBoundary, { key: 'detailed-boundary' }, [
                             React.createElement(DetailedAnalysisSection, { key: 'detailed-analysis', analysis: analysis })
                         ]),
                         analysis.priceAnalysis && React.createElement(ErrorBoundary, { key: 'price-boundary' }, [
                             React.createElement(PriceAnalysisSection, { key: 'price-analysis', priceAnalysis: analysis.priceAnalysis, currencySymbol: analysis.currencySymbol })
                         ]),
                         analysis.brandAnalysis && React.createElement(ErrorBoundary, { key: 'brand-boundary' }, [
                             React.createElement(BrandConcentrationSection, { key: 'brand-analysis', brandAnalysis: analysis.brandAnalysis, brandInsights: analysis.brandInsights })
                         ]),
                         analysis.reviewAnalysis && React.createElement(ErrorBoundary, { key: 'review-boundary' }, [
                            React.createElement(ReviewTimingSection, { key: 'review-analysis', reviewAnalysis: analysis.reviewAnalysis, yearlyInsights: analysis.yearlyInsights })
                        ]),
                        analysis.lifecycleAnalysis && React.createElement(ErrorBoundary, { key: 'lifecycle-boundary' }, [
                            React.createElement(LifecycleAnalysisSection, { key: 'lifecycle-analysis', lifecycleAnalysis: analysis.lifecycleAnalysis, strategicInsights: analysis.strategicInsights })
                        ]),
                        analysis.emergingTrendsAnalysis && React.createElement(ErrorBoundary, { key: 'emerging-trends-boundary' }, [
                            React.createElement(EmergingTrendsSection, { key: 'emerging-trends-analysis', analysisData: analysis.emergingTrendsAnalysis })
                        ]),
                         analysis.finalSummary && React.createElement('div', { key: 'final-summary', className: "bg-white rounded-lg border p-6 shadow-sm" }, [
                             React.createElement('h3', { key: 'title', className: "text-xl font-bold text-gray-900 mb-4 flex items-center" }, [
                                 React.createElement('span', { key: 'icon', className: "mr-3 text-indigo-600" }, "🏆"),
                                 "最终分析总结"
                             ]),
                             React.createElement('div', { key: 'content', className: "text-gray-700 space-y-3" }, [
                                 analysis.finalSummary.opportunity_text && React.createElement('p', { key: 'opportunity' }, analysis.finalSummary.opportunity_text),
                                 analysis.finalSummary.strategy_text && React.createElement('p', { key: 'strategy' }, analysis.finalSummary.strategy_text)
                             ])
                         ]),
                         analysis.metaSummary && React.createElement('div', { key: 'meta-summary', className: "bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-lg border-2 border-purple-200 p-8 shadow-lg" }, [
                             React.createElement('h3', { key: 'title', className: "text-2xl font-bold text-purple-900 mb-6 flex items-center" }, [
                                 React.createElement('span', { key: 'icon', className: "mr-3 text-purple-600" }, "🎯"),
                                 "市场战略总监级分析报告"
                             ]),
                             React.createElement('div', { key: 'content', className: "prose prose-purple max-w-none" }, [
                                 React.createElement('div', {
                                     key: 'markdown-content',
                                     className: "text-gray-800 leading-relaxed",
                                     dangerouslySetInnerHTML: {
                                         __html: analysis.metaSummary
                                             .replace(/^# /gm, '<h1 class="text-2xl font-bold text-purple-900 mb-4 mt-6">')
                                             .replace(/^## /gm, '<h2 class="text-xl font-semibold text-purple-800 mb-3 mt-5">')
                                             .replace(/^### /gm, '<h3 class="text-lg font-medium text-purple-700 mb-2 mt-4">')
                                             .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-purple-900">$1</strong>')
                                             .replace(/^• /gm, '<li class="ml-4 mb-1">• ')
                                             .replace(/\n\n/g, '</p><p class="mb-3">')
                                             .replace(/^(.+)$/gm, '<p class="mb-3">$1</p>')
                                             .replace(/<p class="mb-3"><h/g, '<h')
                                             .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
                                             .replace(/---/g, '<hr class="my-6 border-purple-200">')
                                     }
                                 })
                             ])
                         ])
                     ])
                 ])
             ])
         ])
     ]);
 };

 // 渲染应用
 const rootElement = document.getElementById('root');
 
 // 检查是否已经有React根实例
 if (!window.appRoot) {
     window.appRoot = ReactDOM.createRoot(rootElement);
 }
 
 window.appRoot.render(React.createElement(App));