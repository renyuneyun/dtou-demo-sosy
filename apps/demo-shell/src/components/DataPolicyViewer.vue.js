const POLICY_TURTLE = `@prefix dtou:  <urn:dtou:core#> .
@prefix demo:  <urn:dtou-demo:> .
@prefix vocab: <urn:dtou-demo:vocab#> .

# Information holder for the "provide health suggestions" purpose concept.
demo:attr-health-suggest a dtou:Attribute ;
    dtou:name  demo:health-suggest-attr-name ;
    dtou:class vocab:health-suggestions ;
    dtou:value vocab:nil .

# Tags data as suitable for "provide health suggestions" use.
demo:tagging-health-suggest a dtou:PurposeTag ;
    dtou:attribute_ref demo:attr-health-suggest .

# dtou:app is omitted → prohibition applies to ANY app
demo:prohibition-commercial a dtou:Prohibition ;
    dtou:mode dtou:Use ;
    dtou:activation_condition [
        dtou:purpose vocab:commercial-research
    ] .

demo:health-data-policy a dtou:DataPolicy ;
    dtou:attribute   demo:attr-health-suggest ;
    dtou:tagging     demo:tagging-health-suggest ;
    dtou:prohibition demo:prohibition-commercial .`;
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "bg-white rounded-lg shadow p-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-xl font-semibold text-slate-800 mb-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm text-gray-600 mb-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.pre, __VLS_intrinsicElements.pre)({
    ...{ class: "bg-slate-900 text-slate-100 rounded p-4 text-xs overflow-x-auto leading-relaxed" },
});
(__VLS_ctx.POLICY_TURTLE);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-xs text-gray-500 mt-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.code, __VLS_intrinsicElements.code)({
    ...{ class: "bg-gray-100 px-1 rounded" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.em, __VLS_intrinsicElements.em)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.code, __VLS_intrinsicElements.code)({
    ...{ class: "bg-gray-100 px-1 rounded" },
});
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-100']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            POLICY_TURTLE: POLICY_TURTLE,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
