<template>
  <div>
    <nav aria-label="Page navigation example">
    <ul class="pagination">
        <li class="page-item">
        <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
        </a>
        </li>

        <li class="page-item" v-for="page in innerpage" :key="page.current_page">
            <a class="page-link" href="#"> {{ page.current_page }} </a>
        </li>
        
        <li class="page-item">
        <a class="page-link" href="#" aria-label="Next">
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
    
  },
}