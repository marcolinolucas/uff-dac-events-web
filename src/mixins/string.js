import moment from '@/utils/moment';

function dateFilter(raw) {
  if (!raw || typeof raw !== 'string') return raw;
  return moment(raw).format('DD/MM/YYYY');
}

export default {
  methods: {
    dateFilter,
  },
  filters: {
    dateFilter,
  },
};
