import { ref } from 'vue';
import { useHealthData } from './composables/useHealthData';
import { generateInsights } from './insights';
import { saveReportToPod } from './podWriter';
import PolicyPanel from './components/PolicyPanel.vue';
import InsightsCard from './components/InsightsCard.vue';
import OutputPolicyBadge from './components/OutputPolicyBadge.vue';
import { APP_B_POLICY } from './policy';
const { data, error, loadData } = useHealthData();
const compatibility = ref(null);
const report = ref(null);
const generating = ref(false);
const saved = ref(false);
const savedUrls = ref({ reportUrl: '', policyUrl: '' });
function onResult(result) {
    compatibility.value = result;
    if (result.compatible)
        loadData();
}
function handleGenerate() {
    if (!data.value)
        return;
    generating.value = true;
    report.value = generateInsights(data.value.heartRate, data.value.steps, data.value.sleep);
    generating.value = false;
}
async function handleSave() {
    if (!report.value)
        return;
    const result = await saveReportToPod(report.value, '# derived policy (mock)');
    savedUrls.value = result;
    saved.value = true;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "min-h-screen bg-green-50" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "bg-green-600 text-white px-6 py-4 shadow" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-2xl font-bold" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm opacity-75" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "max-w-3xl mx-auto px-4 py-6 space-y-6" },
});
/** @type {[typeof PolicyPanel, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(PolicyPanel, new PolicyPanel({
    ...{ 'onResult': {} },
    appPolicy: (__VLS_ctx.APP_B_POLICY),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onResult': {} },
    appPolicy: (__VLS_ctx.APP_B_POLICY),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onResult: (__VLS_ctx.onResult)
};
var __VLS_2;
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-red-600 p-4 bg-red-50 rounded" },
    });
    (__VLS_ctx.error);
}
if (__VLS_ctx.data) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.handleGenerate) },
        disabled: (__VLS_ctx.generating),
        ...{ class: "px-5 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 disabled:opacity-50" },
    });
    (__VLS_ctx.generating ? 'Generating…' : 'Generate Insights');
}
if (__VLS_ctx.report) {
    /** @type {[typeof InsightsCard, ]} */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(InsightsCard, new InsightsCard({
        report: (__VLS_ctx.report),
    }));
    const __VLS_8 = __VLS_7({
        report: (__VLS_ctx.report),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
}
if (__VLS_ctx.report && !__VLS_ctx.saved) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.handleSave) },
        ...{ class: "px-5 py-2 bg-green-700 text-white rounded shadow hover:bg-green-800" },
    });
}
/** @type {[typeof OutputPolicyBadge, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(OutputPolicyBadge, new OutputPolicyBadge({
    shown: (__VLS_ctx.saved),
    reportUrl: (__VLS_ctx.savedUrls.reportUrl),
    policyUrl: (__VLS_ctx.savedUrls.policyUrl),
}));
const __VLS_11 = __VLS_10({
    shown: (__VLS_ctx.saved),
    reportUrl: (__VLS_ctx.savedUrls.reportUrl),
    policyUrl: (__VLS_ctx.savedUrls.policyUrl),
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_asFunctionalElement(__VLS_intrinsicElements.footer, __VLS_intrinsicElements.footer)({
    ...{ class: "text-center text-xs text-gray-400 py-6" },
});
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-50']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-75']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-green-700']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-green-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['py-6']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            PolicyPanel: PolicyPanel,
            InsightsCard: InsightsCard,
            OutputPolicyBadge: OutputPolicyBadge,
            APP_B_POLICY: APP_B_POLICY,
            data: data,
            error: error,
            report: report,
            generating: generating,
            saved: saved,
            savedUrls: savedUrls,
            onResult: onResult,
            handleGenerate: handleGenerate,
            handleSave: handleSave,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
