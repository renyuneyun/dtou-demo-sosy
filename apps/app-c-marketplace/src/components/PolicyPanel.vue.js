import { ref } from 'vue';
import { submitAppPolicy, fetchDataPolicyForDisplay, fetchComplianceResult, } from '@dtou-demo/dtou-client';
const props = defineProps();
const emit = defineEmits();
// currentStep: 0 = not started, 1–4 = steps completed
const currentStep = ref(0);
const stepLoading = ref(false);
const stepError = ref(null);
// Real data from each step
const step1Turtle = ref(null);
const step1Status = ref(null);
// Step 2 is server-side — optional display fetch only
const step2Policies = ref(null);
const step2FetchLoading = ref(false);
const step2FetchError = ref(null);
const step3Raw = ref(null);
const step3Status = ref(null);
const compatResult = ref(null);
async function executeStep(n) {
    if (stepLoading.value || n < 1 || n > 4)
        return;
    stepLoading.value = true;
    stepError.value = null;
    try {
        switch (n) {
            case 1: {
                // POST /dtou — submit app policy; returns the turtle sent
                const r1 = await submitAppPolicy(props.appPolicy);
                step1Turtle.value = r1.turtle;
                step1Status.value = r1.status;
                currentStep.value = 1;
                break;
            }
            case 2: {
                // Server-side step — no client call needed, advance immediately
                currentStep.value = 2;
                break;
            }
            case 3: {
                // GET /dtou/compliance — retrieve reasoning result
                const r3 = await fetchComplianceResult(props.appPolicy);
                step3Raw.value = r3.raw;
                step3Status.value = r3.status;
                compatResult.value = r3.result;
                currentStep.value = 3;
                break;
            }
            case 4: {
                // Reveal decision and notify parent
                currentStep.value = 4;
                emit('result', compatResult.value);
                break;
            }
        }
    }
    catch (e) {
        stepError.value = e.message ?? 'Unknown error';
    }
    finally {
        stepLoading.value = false;
    }
}
async function fetchDataPolicyForStep2() {
    if (step2FetchLoading.value)
        return;
    step2FetchLoading.value = true;
    step2FetchError.value = null;
    try {
        const display = await fetchDataPolicyForDisplay(props.appPolicy.inputs[0].dataUri);
        step2Policies.value = [display];
    }
    catch (e) {
        step2FetchError.value = e.message ?? 'Unknown error';
    }
    finally {
        step2FetchLoading.value = false;
    }
}
async function nextStep() {
    if (!stepLoading.value && currentStep.value < 4) {
        await executeStep(currentStep.value + 1);
    }
}
async function runAll() {
    for (let n = currentStep.value + 1; n <= 4; n++) {
        await executeStep(n);
        if (stepError.value)
            break;
    }
}
function reset() {
    if (stepLoading.value)
        return;
    currentStep.value = 0;
    stepError.value = null;
    step1Turtle.value = null;
    step1Status.value = null;
    step2Policies.value = null;
    step2FetchLoading.value = false;
    step2FetchError.value = null;
    step3Raw.value = null;
    step3Status.value = null;
    compatResult.value = null;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.details, __VLS_intrinsicElements.details)({
    ...{ class: "bg-white rounded-lg shadow border border-gray-200" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.summary, __VLS_intrinsicElements.summary)({
    ...{ class: "px-4 py-3 cursor-pointer font-semibold text-gray-700 select-none flex items-center gap-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
if (__VLS_ctx.stepLoading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-xs text-gray-400" },
    });
}
else if (__VLS_ctx.compatResult?.compatible) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "ml-auto text-xs bg-green-100 text-green-800 border border-green-300 rounded px-2 py-0.5 font-semibold" },
    });
}
else if (__VLS_ctx.compatResult && !__VLS_ctx.compatResult.compatible) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "ml-auto text-xs bg-red-100 text-red-800 border border-red-300 rounded px-2 py-0.5 font-semibold" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "border-t border-gray-200 px-4 py-4 space-y-5 text-sm" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "font-semibold text-gray-700 mb-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.ol, __VLS_intrinsicElements.ol)({
    ...{ class: "space-y-4 mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
    ...{ class: "flex gap-3" },
    ...{ class: (__VLS_ctx.currentStep < 1 && !__VLS_ctx.stepLoading ? 'opacity-40' : '') },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border" },
    ...{ class: (__VLS_ctx.currentStep > 1
            ? 'bg-blue-100 text-blue-700 border-blue-300'
            : __VLS_ctx.currentStep === 1
                ? 'bg-blue-500 text-white border-blue-500'
                : __VLS_ctx.stepLoading && __VLS_ctx.currentStep === 0
                    ? 'bg-blue-200 text-blue-600 border-blue-300'
                    : 'bg-gray-100 text-gray-400 border-gray-300') },
});
if (__VLS_ctx.stepLoading && __VLS_ctx.currentStep === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        ...{ class: "animate-spin h-3 w-3" },
        viewBox: "0 0 24 24",
        fill: "none",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.circle)({
        ...{ class: "opacity-25" },
        cx: "12",
        cy: "12",
        r: "10",
        stroke: "currentColor",
        'stroke-width': "4",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        ...{ class: "opacity-75" },
        fill: "currentColor",
        d: "M4 12a8 8 0 018-8v8z",
    });
}
else {
    (__VLS_ctx.currentStep >= 1 ? '✓' : '1');
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex-1 min-w-0" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "font-medium text-gray-700" },
});
if (__VLS_ctx.currentStep >= 1) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "mt-0.5 text-xs text-gray-500 flex items-center gap-2 flex-wrap" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.code, __VLS_intrinsicElements.code)({
        ...{ class: "font-mono bg-gray-100 px-1 rounded" },
    });
    if (__VLS_ctx.step1Status !== null) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "font-mono px-1.5 py-0.5 rounded text-xs font-semibold" },
            ...{ class: (__VLS_ctx.step1Status >= 200 && __VLS_ctx.step1Status < 300
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700') },
        });
        (__VLS_ctx.step1Status);
    }
}
if (__VLS_ctx.step1Turtle) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.details, __VLS_intrinsicElements.details)({
        ...{ class: "text-xs" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.summary, __VLS_intrinsicElements.summary)({
        ...{ class: "cursor-pointer text-blue-600 hover:text-blue-800 select-none" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.pre, __VLS_intrinsicElements.pre)({
        ...{ class: "mt-1 bg-slate-900 text-slate-200 rounded p-3 overflow-x-auto leading-relaxed max-h-48" },
    });
    (__VLS_ctx.step1Turtle);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
    ...{ class: "flex gap-3" },
    ...{ class: (__VLS_ctx.currentStep < 2 ? 'opacity-40' : '') },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border" },
    ...{ class: (__VLS_ctx.currentStep >= 2
            ? 'bg-gray-200 text-gray-600 border-gray-400'
            : 'bg-gray-100 text-gray-400 border-gray-300') },
});
(__VLS_ctx.currentStep >= 2 ? '✓' : '2');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex-1 min-w-0" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "font-medium text-gray-700 flex items-center gap-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-xs font-normal text-gray-400 bg-gray-100 border border-gray-300 rounded px-1.5 py-0.5" },
});
if (__VLS_ctx.currentStep >= 2) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "mt-0.5 text-xs text-gray-500" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.code, __VLS_intrinsicElements.code)({
        ...{ class: "font-mono bg-gray-100 px-1 rounded" },
    });
}
if (__VLS_ctx.currentStep >= 2) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-2 space-y-2" },
    });
    if (!__VLS_ctx.step2Policies) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.fetchDataPolicyForStep2) },
            disabled: (__VLS_ctx.step2FetchLoading),
            ...{ class: "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50" },
        });
        if (__VLS_ctx.step2FetchLoading) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
                ...{ class: "animate-spin h-3 w-3" },
                viewBox: "0 0 24 24",
                fill: "none",
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.circle)({
                ...{ class: "opacity-25" },
                cx: "12",
                cy: "12",
                r: "10",
                stroke: "currentColor",
                'stroke-width': "4",
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
                ...{ class: "opacity-75" },
                fill: "currentColor",
                d: "M4 12a8 8 0 018-8v8z",
            });
        }
        (__VLS_ctx.step2FetchLoading ? 'Fetching…' : 'Fetch data policy for display');
    }
    if (__VLS_ctx.step2FetchError) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-xs text-red-600" },
        });
        (__VLS_ctx.step2FetchError);
    }
    if (__VLS_ctx.step2Policies) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "space-y-1" },
        });
        for (const [dp] of __VLS_getVForSourceType((__VLS_ctx.step2Policies))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.details, __VLS_intrinsicElements.details)({
                key: (dp.resourceUrl),
                ...{ class: "text-xs" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.summary, __VLS_intrinsicElements.summary)({
                ...{ class: "cursor-pointer text-blue-600 hover:text-blue-800 select-none flex items-center gap-2" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "font-mono text-gray-400" },
            });
            (dp.resourceUrl);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "font-mono px-1.5 py-0.5 rounded font-semibold" },
                ...{ class: (dp.status >= 200 && dp.status < 300
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700') },
            });
            (dp.status);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.pre, __VLS_intrinsicElements.pre)({
                ...{ class: "mt-1 bg-slate-900 text-slate-200 rounded p-3 overflow-x-auto leading-relaxed max-h-48" },
            });
            (dp.raw);
        }
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
    ...{ class: "flex gap-3" },
    ...{ class: (__VLS_ctx.currentStep < 3 && !(__VLS_ctx.stepLoading && __VLS_ctx.currentStep === 2) ? 'opacity-40' : '') },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border" },
    ...{ class: (__VLS_ctx.currentStep > 3
            ? 'bg-blue-100 text-blue-700 border-blue-300'
            : __VLS_ctx.currentStep === 3
                ? 'bg-blue-500 text-white border-blue-500'
                : __VLS_ctx.stepLoading && __VLS_ctx.currentStep === 2
                    ? 'bg-blue-200 text-blue-600 border-blue-300'
                    : 'bg-gray-100 text-gray-400 border-gray-300') },
});
if (__VLS_ctx.stepLoading && __VLS_ctx.currentStep === 2) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        ...{ class: "animate-spin h-3 w-3" },
        viewBox: "0 0 24 24",
        fill: "none",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.circle)({
        ...{ class: "opacity-25" },
        cx: "12",
        cy: "12",
        r: "10",
        stroke: "currentColor",
        'stroke-width': "4",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        ...{ class: "opacity-75" },
        fill: "currentColor",
        d: "M4 12a8 8 0 018-8v8z",
    });
}
else {
    (__VLS_ctx.currentStep >= 3 ? '✓' : '3');
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex-1 min-w-0" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "font-medium text-gray-700" },
});
if (__VLS_ctx.currentStep >= 3) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "mt-0.5 text-xs text-gray-500 flex items-center gap-2 flex-wrap" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.code, __VLS_intrinsicElements.code)({
        ...{ class: "font-mono bg-gray-100 px-1 rounded" },
    });
    if (__VLS_ctx.step3Status !== null) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "font-mono px-1.5 py-0.5 rounded text-xs font-semibold" },
            ...{ class: (__VLS_ctx.step3Status >= 200 && __VLS_ctx.step3Status < 300
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700') },
        });
        (__VLS_ctx.step3Status);
    }
}
if (__VLS_ctx.step3Raw) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.details, __VLS_intrinsicElements.details)({
        ...{ class: "text-xs" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.summary, __VLS_intrinsicElements.summary)({
        ...{ class: "cursor-pointer text-blue-600 hover:text-blue-800 select-none" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.pre, __VLS_intrinsicElements.pre)({
        ...{ class: "mt-1 bg-slate-900 text-slate-200 rounded p-3 overflow-x-auto leading-relaxed max-h-48" },
    });
    (__VLS_ctx.step3Raw);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
    ...{ class: "flex gap-3" },
    ...{ class: (__VLS_ctx.currentStep < 4 && !(__VLS_ctx.stepLoading && __VLS_ctx.currentStep === 3) ? 'opacity-40' : '') },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border" },
    ...{ class: (__VLS_ctx.currentStep < 4
            ? __VLS_ctx.stepLoading && __VLS_ctx.currentStep === 3
                ? 'bg-blue-200 text-blue-600 border-blue-300'
                : 'bg-gray-100 text-gray-400 border-gray-300'
            : __VLS_ctx.compatResult?.compatible
                ? 'bg-green-500 text-white border-green-500'
                : 'bg-red-500 text-white border-red-500') },
});
if (__VLS_ctx.stepLoading && __VLS_ctx.currentStep === 3) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        ...{ class: "animate-spin h-3 w-3" },
        viewBox: "0 0 24 24",
        fill: "none",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.circle)({
        ...{ class: "opacity-25" },
        cx: "12",
        cy: "12",
        r: "10",
        stroke: "currentColor",
        'stroke-width': "4",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        ...{ class: "opacity-75" },
        fill: "currentColor",
        d: "M4 12a8 8 0 018-8v8z",
    });
}
else if (__VLS_ctx.currentStep >= 4 && __VLS_ctx.compatResult?.compatible) {
}
else if (__VLS_ctx.currentStep >= 4) {
}
else {
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex-1 min-w-0" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "font-medium text-gray-700" },
});
if (__VLS_ctx.currentStep >= 4 && __VLS_ctx.compatResult) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-1" },
    });
    if (__VLS_ctx.compatResult.compatible) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2" },
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 space-y-1" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "font-semibold" },
        });
        (__VLS_ctx.compatResult.conflicts.length);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
            ...{ class: "list-disc list-inside text-xs space-y-0.5" },
        });
        for (const [c, i] of __VLS_getVForSourceType((__VLS_ctx.compatResult.conflicts))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
                key: (i),
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "font-medium" },
            });
            (c.type);
            (c.detail);
        }
    }
}
if (__VLS_ctx.stepError) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mb-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2" },
    });
    (__VLS_ctx.stepError);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.nextStep) },
    disabled: (__VLS_ctx.currentStep >= 4 || __VLS_ctx.stepLoading),
    ...{ class: "\u0070\u0078\u002d\u0033\u0020\u0070\u0079\u002d\u0031\u002e\u0035\u0020\u0074\u0065\u0078\u0074\u002d\u0078\u0073\u0020\u0072\u006f\u0075\u006e\u0064\u0065\u0064\u0020\u0062\u006f\u0072\u0064\u0065\u0072\u0020\u0066\u006f\u006e\u0074\u002d\u006d\u0065\u0064\u0069\u0075\u006d\u0020\u0074\u0072\u0061\u006e\u0073\u0069\u0074\u0069\u006f\u006e\u002d\u0063\u006f\u006c\u006f\u0072\u0073\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0064\u0069\u0073\u0061\u0062\u006c\u0065\u0064\u003a\u006f\u0070\u0061\u0063\u0069\u0074\u0079\u002d\u0034\u0030\u0020\u0064\u0069\u0073\u0061\u0062\u006c\u0065\u0064\u003a\u0063\u0075\u0072\u0073\u006f\u0072\u002d\u006e\u006f\u0074\u002d\u0061\u006c\u006c\u006f\u0077\u0065\u0064\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0062\u006f\u0072\u0064\u0065\u0072\u002d\u0062\u006c\u0075\u0065\u002d\u0034\u0030\u0030\u0020\u0074\u0065\u0078\u0074\u002d\u0062\u006c\u0075\u0065\u002d\u0037\u0030\u0030\u0020\u0068\u006f\u0076\u0065\u0072\u003a\u0062\u0067\u002d\u0062\u006c\u0075\u0065\u002d\u0035\u0030\u0020\u0064\u0069\u0073\u0061\u0062\u006c\u0065\u0064\u003a\u0068\u006f\u0076\u0065\u0072\u003a\u0062\u0067\u002d\u0077\u0068\u0069\u0074\u0065" },
});
(__VLS_ctx.currentStep === 0 ? '▶ Start' : 'Next Step →');
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.runAll) },
    disabled: (__VLS_ctx.currentStep >= 4 || __VLS_ctx.stepLoading),
    ...{ class: "\u0070\u0078\u002d\u0033\u0020\u0070\u0079\u002d\u0031\u002e\u0035\u0020\u0074\u0065\u0078\u0074\u002d\u0078\u0073\u0020\u0072\u006f\u0075\u006e\u0064\u0065\u0064\u0020\u0062\u006f\u0072\u0064\u0065\u0072\u0020\u0066\u006f\u006e\u0074\u002d\u006d\u0065\u0064\u0069\u0075\u006d\u0020\u0074\u0072\u0061\u006e\u0073\u0069\u0074\u0069\u006f\u006e\u002d\u0063\u006f\u006c\u006f\u0072\u0073\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0064\u0069\u0073\u0061\u0062\u006c\u0065\u0064\u003a\u006f\u0070\u0061\u0063\u0069\u0074\u0079\u002d\u0034\u0030\u0020\u0064\u0069\u0073\u0061\u0062\u006c\u0065\u0064\u003a\u0063\u0075\u0072\u0073\u006f\u0072\u002d\u006e\u006f\u0074\u002d\u0061\u006c\u006c\u006f\u0077\u0065\u0064\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0062\u006f\u0072\u0064\u0065\u0072\u002d\u0067\u0072\u0061\u0079\u002d\u0034\u0030\u0030\u0020\u0074\u0065\u0078\u0074\u002d\u0067\u0072\u0061\u0079\u002d\u0037\u0030\u0030\u0020\u0068\u006f\u0076\u0065\u0072\u003a\u0062\u0067\u002d\u0067\u0072\u0061\u0079\u002d\u0035\u0030\u0020\u0064\u0069\u0073\u0061\u0062\u006c\u0065\u0064\u003a\u0068\u006f\u0076\u0065\u0072\u003a\u0062\u0067\u002d\u0077\u0068\u0069\u0074\u0065" },
});
if (__VLS_ctx.currentStep > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.reset) },
        disabled: (__VLS_ctx.stepLoading),
        ...{ class: "\u0070\u0078\u002d\u0033\u0020\u0070\u0079\u002d\u0031\u002e\u0035\u0020\u0074\u0065\u0078\u0074\u002d\u0078\u0073\u0020\u0072\u006f\u0075\u006e\u0064\u0065\u0064\u0020\u0074\u0065\u0078\u0074\u002d\u0067\u0072\u0061\u0079\u002d\u0034\u0030\u0030\u0020\u0068\u006f\u0076\u0065\u0072\u003a\u0074\u0065\u0078\u0074\u002d\u0067\u0072\u0061\u0079\u002d\u0036\u0030\u0030\u0020\u0074\u0072\u0061\u006e\u0073\u0069\u0074\u0069\u006f\u006e\u002d\u0063\u006f\u006c\u006f\u0072\u0073\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0064\u0069\u0073\u0061\u0062\u006c\u0065\u0064\u003a\u006f\u0070\u0061\u0063\u0069\u0074\u0079\u002d\u0034\u0030\u0020\u0064\u0069\u0073\u0061\u0062\u006c\u0065\u0064\u003a\u0063\u0075\u0072\u0073\u006f\u0072\u002d\u006e\u006f\u0074\u002d\u0061\u006c\u006c\u006f\u0077\u0065\u0064" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "font-semibold text-gray-700 mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-gray-500 mb-2" },
});
(props.appPolicy.description);
__VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)({
    ...{ class: "w-full text-xs border-collapse" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
    ...{ class: "bg-gray-50" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
    ...{ class: "text-left p-1.5 border border-gray-200" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
    ...{ class: "text-left p-1.5 border border-gray-200" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
    ...{ class: "text-left p-1.5 border border-gray-200" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
for (const [input] of __VLS_getVForSourceType((props.appPolicy.inputs))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
        key: (input.uri),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
        ...{ class: "p-1.5 border border-gray-200 font-mono text-gray-500 truncate max-w-[12rem]" },
    });
    (input.dataUri);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
        ...{ class: "p-1.5 border border-gray-200" },
    });
    (input.port.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
        ...{ class: "p-1.5 border border-gray-200" },
    });
    for (const [p] of __VLS_getVForSourceType((input.purposes))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            key: (p.uri),
            ...{ class: "block font-mono text-blue-700" },
            title: (p.name),
        });
        (p.name.split(/[#/]/).pop());
    }
}
if (props.appPolicy.outputs.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-2 text-xs text-gray-500" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-medium" },
    });
    for (const [o] of __VLS_getVForSourceType((props.appPolicy.outputs))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            key: (o.uri),
            ...{ class: "ml-2" },
        });
        (o.port.name);
        (o.fromPorts.length);
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-1 text-xs text-gray-400" },
    });
}
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['select-none']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-100']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-800']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-green-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-100']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-800']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-red-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-3']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-25']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-75']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-blue-800']} */ ;
/** @type {__VLS_StyleScopedClasses['select-none']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-48']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-normal']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-3']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-25']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-75']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-blue-800']} */ ;
/** @type {__VLS_StyleScopedClasses['select-none']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-48']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-3']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-25']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-75']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-blue-800']} */ ;
/** @type {__VLS_StyleScopedClasses['select-none']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-48']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-3']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-25']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-75']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-700']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-green-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-700']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-red-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['list-disc']} */ ;
/** @type {__VLS_StyleScopedClasses['list-inside']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-700']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-red-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-40']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ ;
/** @type {__VLS_StyleScopedClasses['border-blue-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-blue-50']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:hover:bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-40']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:hover:bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-40']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['border-collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-[12rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            currentStep: currentStep,
            stepLoading: stepLoading,
            stepError: stepError,
            step1Turtle: step1Turtle,
            step1Status: step1Status,
            step2Policies: step2Policies,
            step2FetchLoading: step2FetchLoading,
            step2FetchError: step2FetchError,
            step3Raw: step3Raw,
            step3Status: step3Status,
            compatResult: compatResult,
            fetchDataPolicyForStep2: fetchDataPolicyForStep2,
            nextStep: nextStep,
            runAll: runAll,
            reset: reset,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
