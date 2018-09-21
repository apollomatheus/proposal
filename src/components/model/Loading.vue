<template>
    <div id="box" :start="start">
        <center>
            <h3> <i class="fas fa-spinner fa-spin"></i></h3>
            <p>
                Loading<i>{{fun}}</i>
            </p> 
        </center>
    </div>
</template>

<script>
  export default {
    data () {
      return {
          fun:'',
      };
    },
    computed: {
        start() {
            setInterval(() => {
                if (this.fun.length > 3) {
                    this.fun = '.';
                } else {
                    this.fun = this.fun + '.';
                }
            },1000);
        }
    }
  }
</script>

<style scoped>

#box {
    font-family: Calibri;
    color: #12a2dd;
    position: absolute;
    margin:0;
    padding: 100px;
    top: 80px;
    bottom: 0;
    width: 100%;
}
h3 {
    margin: 15px;
    font-size: 56px;
    font-weight: 600;
}
p {
  padding: 5px;
  font-size: 30px;
  font-weight: 1000px;
}
</style>
