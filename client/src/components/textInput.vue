<template>
  <div>
    <input
      :type="type"
      :placeholder="placeholder"
      class="form-control"
      :value="value"
      :name="name"
      @input="$emit('input', $event.target.value)"
      @blur="$emit('blur')"
      @change="$emit('input', $event.target.value)"
      @focus="$emit('focus')"
    />
    <small v-if="error" class="text-danger">{{ error }}</small>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: false,
      default: 'text'
    },
    value: {
      type: String,
      required: false,
      default: ''
    },
    name: {
      type: String,
      required: true
    },
    error: {
      type: String,
      required: false
    }
  }
};
</script>
