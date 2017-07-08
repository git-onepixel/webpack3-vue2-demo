<template>
    <article>
        <div class="index-wrapper">
           <h3>{{welcome}}</h3>
           <input type="checkbox">
        </div>
    </article>
</template>
<script>
    export default {
        data(){
            return {
                welcome:'Hello,Vue!'
            }
        }
    }    
</script>