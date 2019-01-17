export default {
  install: function(Vue) {
    // Filters
    Vue.filter("capitalize", capitalize);
    Vue.filter("upperCase", upperCase);
    Vue.filter("truncate", truncate);
  }
};

export function capitalize(value) {
  if (!value && value !== 0) {
    return "";
  }
  value = value.toString().toLowerCase();
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function upperCase(value) {
  if (!value) return value;
  return value.toUpperCase();
}

export function truncate(value, charNum, type) {
  const separator = "....";
  if (!value || !charNum) return value;
  switch (type) {
    case "middle": {
      const len = value.length;
      return (
        value.substring(0, charNum) + separator + value.substring(len - charNum, len)
      );
    }
    default: {
      return value.substring(0, charNum) + separator;
    }
  }
}
