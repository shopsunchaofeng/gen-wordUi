<template>
  <el-dialog
    title="查看内容"
    :close-on-click-modal="false"
    :append-to-body="true"
    height="200px"
    :visible.sync="visible">
      <el-carousel indicator-position="outside" style="height: 600px">
        <el-carousel-item v-for="item in imageArray" :key="item" style="height: 600px">
            <el-image  v-if="item" :src="item" style="width: 100%;height: 100%"></el-image>
        </el-carousel-item>
      </el-carousel>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: '',
          images: ''},
        imageArray: []
      }
    },
    methods: {
      init (id, url, i) {
        this.dataForm.id = id
        this.visible = true
        if (this.dataForm.id) {
          this.$http({
            url: url + `/${this.dataForm.id}?type=` + i,
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.dataForm.images = data.data.images
              this.imageArray = this.dataForm.images.split(',')
            }
          })
        }
      }
    }
  }
</script>
