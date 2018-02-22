(function() {
    $$('h2[id]').forEach((h) => {
        h.append('a.int-ref  §  ').href = '#' + h.id;
    });
})();
