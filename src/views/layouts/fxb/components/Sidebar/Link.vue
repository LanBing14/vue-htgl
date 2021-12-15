<template>
<!-- eslint-disable vue/require-component-is-->
<component v-bind="linkProps(to)">
    <slot/>
</component>
</template>

<script>
    import {isExternal} from '@/utils'

    export default {
        props: {
            to: {
                type: String,
                required: true
            },
            newWindow: {
                type: Boolean,
                default() {
                    return false
                }
            }
        },
        methods: {
            isExternalLink(routePath) {
                return isExternal(routePath)
            },
            linkProps(url) {
                if (this.isExternalLink(url) || this.newWindow) {
                    return {
                        is: 'a',
                        href: url,
                        target: '_blank',
                        rel: 'noopener'
                    }
                }
                return {
                    is: 'router-link',
                    to: url
                }
            }
        }
    }
</script>
