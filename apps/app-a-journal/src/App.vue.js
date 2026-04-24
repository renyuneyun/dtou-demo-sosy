import { ref } from 'vue';
import { useHealthData } from './composables/useHealthData';
import PolicyPanel from './components/PolicyPanel.vue';
import HealthContextSidebar from './components/HealthContextSidebar.vue';
import DatePicker from './components/DatePicker.vue';
import { APP_A_POLICY } from './policy';
const MOCK_JOURNAL = {
    '2024-03-01': 'Productive morning — finished the literature review draft. Afternoon walk helped clear my head. Feeling good about the direction of the research.',
    '2024-03-02': 'Long day of meetings. Skipped lunch, probably why energy was low. Need to plan better tomorrow.',
};
const { data, error, loadData } = useHealthData();
const compatibility = ref(null);
const selectedDate = ref('2024-03-01');
function onResult(result) {
    compatibility.value = result;
    if (result.compatible)
        loadData();
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "min-h-screen bg-amber-50" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "bg-amber-600 text-white px-6 py-4 shadow" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-2xl font-bold" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm opacity-75" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "max-w-5xl mx-auto px-4 py-6 space-y-6" },
});
/** @type {[typeof PolicyPanel, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(PolicyPanel, new PolicyPanel({
    ...{ 'onResult': {} },
    appPolicy: (__VLS_ctx.APP_A_POLICY),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onResult': {} },
    appPolicy: (__VLS_ctx.APP_A_POLICY),
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
if (__VLS_ctx.compatibility && !__VLS_ctx.compatibility.compatible) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-red-50 border border-red-300 rounded p-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: "font-semibold text-red-700" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
        ...{ class: "mt-2 text-sm text-red-600 list-disc list-inside" },
    });
    for (const [c, i] of __VLS_getVForSourceType((__VLS_ctx.compatibility.conflicts))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
            key: (i),
        });
        (c.detail);
    }
}
if (__VLS_ctx.data) {
    /** @type {[typeof DatePicker, ]} */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(DatePicker, new DatePicker({
        dates: (['2024-03-01', '2024-03-02']),
        modelValue: (__VLS_ctx.selectedDate),
    }));
    const __VLS_8 = __VLS_7({
        dates: (['2024-03-01', '2024-03-02']),
        modelValue: (__VLS_ctx.selectedDate),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex gap-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex-1 bg-white rounded-lg shadow p-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: "font-semibold text-gray-700 mb-3" },
    });
    (__VLS_ctx.selectedDate);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-gray-600 leading-relaxed italic" },
    });
    (__VLS_ctx.MOCK_JOURNAL[__VLS_ctx.selectedDate] ?? 'No entry for this date.');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "w-56 shrink-0" },
    });
    /** @type {[typeof HealthContextSidebar, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(HealthContextSidebar, new HealthContextSidebar({
        date: (__VLS_ctx.selectedDate),
        heartRate: (__VLS_ctx.data.heartRate),
        steps: (__VLS_ctx.data.steps),
        sleep: (__VLS_ctx.data.sleep),
    }));
    const __VLS_11 = __VLS_10({
        date: (__VLS_ctx.selectedDate),
        heartRate: (__VLS_ctx.data.heartRate),
        steps: (__VLS_ctx.data.steps),
        sleep: (__VLS_ctx.data.sleep),
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.footer, __VLS_intrinsicElements.footer)({
    ...{ class: "text-center text-xs text-gray-400 py-6" },
});
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-amber-50']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-amber-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-75']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-5xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-red-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['list-disc']} */ ;
/** @type {__VLS_StyleScopedClasses['list-inside']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
/** @type {__VLS_StyleScopedClasses['italic']} */ ;
/** @type {__VLS_StyleScopedClasses['w-56']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['py-6']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            PolicyPanel: PolicyPanel,
            HealthContextSidebar: HealthContextSidebar,
            DatePicker: DatePicker,
            APP_A_POLICY: APP_A_POLICY,
            MOCK_JOURNAL: MOCK_JOURNAL,
            data: data,
            error: error,
            compatibility: compatibility,
            selectedDate: selectedDate,
            onResult: onResult,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
