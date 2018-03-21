<template>
    <div class="main-header">
        <div class="logo"></div>
        <h1 class="name">茗音乐</h1>
    </div>
</template>

<script></script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~assets/stylus/variable.styl"
@import "~assets/stylus/mixin.styl"

.main-header
    position:relative
    height:44px
    text-align:center
    color: $color-theme
    font-size:0
    .logo
        display: inline-block
        vertical-align: top
        margin-top: 6px
        width: 32px
        height: 32px
        margin-right: 9px
        bg-image('logo')
        background-size: 32px 32px
    .name
        display:inline-block
        vertical-align: top
        line-height: 44px
        font-size: $font-size-large

</style>