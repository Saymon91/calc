const operations = {
  decoded: new Map([
    [/\sadd\s/g, ' + '],
    [/\ssub\s/g, ' - '],
    [/\sdiv\s/g, ' / '],
    [/\smul\s/g, ' * '],
  ]),
  encoded: new Map([
    [/\s\+\s/g, ' add '],
    [/\s-\s/g, ' sub '],
    [/\s\/\s/g, ' div '],
    [/\s\*\s/g, ' mul '],
  ])
};