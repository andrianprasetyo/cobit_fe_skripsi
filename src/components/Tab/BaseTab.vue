<template>
  <ul class="nav nav-pills user-profile-tab" id="pills-tab" role="tablist">
    <slot name="tab-navigation" />
  </ul>

  <div class="card-body">
    <div class="tab-content" id="pills-tabContent">
      <slot name="tab-content" />
    </div>
  </div>
</template>