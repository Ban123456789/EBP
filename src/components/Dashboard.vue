<template>
<div>
    <div class="container-fluid">
        <navbar/>
        <div class="row">
            <sidebar/>
            <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4">
                <router-view/>
            </main>
        </div>
    </div>
</div>
  
</template>

<script>
import sidebar from './Sidebar';
import navbar from './Navbar'

export default {
  components:{
      sidebar,
      navbar,
  },
}
</script>