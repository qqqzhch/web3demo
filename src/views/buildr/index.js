export default {
  name: 'Buildr',
  data() {
    return {
      nav: ''
    };
  },
  methods: {
    toPage(name) {
      this.nav = name;
      switch (name) {
        case 'balance':
          this.$router.push(`/buildr/balance`);
          break;

        case 'create':
          this.$router.push(`/buildr/create`);
          break;

        case 'history':
          this.$router.push(`/buildr/history`);
          break;

        default:
          this.$router.push(`/buildr/balance`);
          break;
      }
    },
  }
};
