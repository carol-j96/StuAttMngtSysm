<template>
    <button 
    class="stamp" 
    :class="{ present: status === 'present', late: status === 'late', absent: status === 'absent'}"
    @click="$emit('toggle')"> 
        {{label}}
        </button>
</template>
   
<script setup >
import {computed} from 'vue'

    const props = defineProps({
        status: { type: String, default: null }
    })
    defineEmits(['toggle'])

    const label= computed(()=>{
        if(props.status==='present') return 'PRESENT'
        if(props.status==='late') return 'LATE'
        if(props.status==='absent') return 'ABSENT'
        return 'MARK'
    })
</script>
  
<style scoped>
    .stamp {
        font-family: var(--font-mono);
        font-weight: 500;
        font-size: 0.75rem;
        letter-spacing: 0.05rem;
        padding: 0.4rem 0.75rem;
        border-radius: 3px;
        border: 2px dashed var(--border);
        background: transparent;
        color: var(--ink-soft);
        transition: transform 0.12s ease;
    }
    .stamp:hover {
        transform: rotate(0deg) scale(1.03);
    }

    .stamp.present {
        border-color: var(--present);
        color: var(--present);
        background: var(--present-bg);
    }

    .stamp.late {
        border-color: var(--late);
        color: var(--late);
        background: var(--late-bg);
    }

    .stamp.absent {
        border-color: var(--absent);
        color: var(--absent);
        background: var(--absent-bg);
    }
</style>