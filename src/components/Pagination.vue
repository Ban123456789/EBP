<template>
  <div>
    <nav aria-label="Page navigation example">
    <ul class="pagination">
        <li class="page-item" :class="{disabled:innerpage.has_pre === false}">
        <a class="page-link" href="#" aria-label="Previous" @click.prevent="changePage(innerpage.current_page - 1)">
            <span aria-hidden="true">&laquo;</span>
        </a>
        </li>
                                <!-- 因為 innerpage 為一物件，所以不能直接用 v-for="page in innerpage" -->
        <li class="page-item" v-for="page in innerpage.total_pages" :key="page"
                                :class="{active:innerpage.current_page === page}">
            <a class="page-link" href="#" @click.prevent="changePage(page)"> {{ page }} </a>
        </li>
        
        <li class="page-item" :class="{disabled:innerpage.has_next === false}">
        <a class="page-link" href="#" aria-label="Next" @click.prevent="changePage(innerpage.current_page + 1)">
            <span aria-hidden="true">&raquo;</span>
        </a>
        </li>
    </ul>
    </nav>
  </div>
</template>

<script>

export default {
  name: 'Pagination',
  props: ['innerpage'],
  methods: {
    changePage(page) {
        this.$emit('childChange', page);
    },
  },
}
</script>