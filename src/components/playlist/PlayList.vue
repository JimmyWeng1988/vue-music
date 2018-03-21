<template>
  <transition name='list-fade'>
    <div class="playlist">
      <div class="list-wrapper">
        <!-- 头部 -->
        <div class="list-header">
          <h1 class="title">
            <i class="icon"></i>
            <span class="text"></span>
            <span class="clear"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <!-- 内容部分 -->
        <div class="list-content">
          <ul>
            <li class="item">
              <i class="current"></i>
              <span class="text"></span>
              <span class="like"><i class="icon-not-favorite"></i></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </transition>
</template>
