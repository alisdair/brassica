export function rol(n, i) {
  return ((n << i) | (n >>> (32 - i))) >>> 0;
}

export function ror(n, i) {
  return ((n >>> i) | (n << (32 - i))) >>> 0;
}

export function hex(n, l) {
  let h = n.toString(16).toUpperCase();

  while (h.length < l) {
    h = '0' + h;
  }

  return `0x${h}`;
};

export function encode(n) {
  for (let i = 0; i < 16; i++) {
    let m = rol(n, i * 2);

    if (m < 256)
      return (i << 8) | m;
  }

  throw 'Unencodable constant';
}

function modify(f) {
  let input = document.getElementById('number_input');
  input.value = hex(f(parseInt(input.value)), 8);
  update();
}

function encodedBits(n) {
  let g = document.getElementById('encoded_bits');

  for (let i = 0; i < g.childNodes.length; i++) {
    let node = g.childNodes[i].childNodes[0];
    node.textContent = ((n >>> (11 - i)) & 1).toString();
  }

  let shift = (n >>> 8) & 0xF;
  let immediate = n & 0xFF;
  document.getElementById('encoded_shift').textContent = hex(shift, 1);
  document.getElementById('encoded_immediate').textContent = hex(immediate, 1);

  decode = ror(immediate, shift * 2);
  
  let e = document.getElementById('encoder_output');
  e.textContent = hex(immediate, 1) + ' ROR ' + (shift * 2) + ' = ' + decode;
  e.className = '';
}

function bits(n) {
  let g = document.getElementById('decoded_bits');

  for (let i = 0; i < 32; i++) {
    node = g.childNodes[i].childNodes[1];
    node.textContent = ((n >>> (31 - i)) & 1).toString();
  }
}

function span(shift) {
  let i, bits = ror(0xFF, shift * 2),
    g = document.getElementById('decoded_bits'),
    r;

  for (i = 0; i < 32; i++) {
    r = g.childNodes[i].childNodes[0];

    if (bits & (1 << (31 - i))) {
      r.setAttribute('class', 'span');
    } else {
      r.setAttribute('class', '');
    }
  }
}

function encodeError() {
  let i, g = document.getElementById('encoded_bits'), node;

  for (i = 0; i < g.childNodes.length; i++) {
    node = g.childNodes[i].childNodes[0];
    node.textContent = ' ';
  }

  document.getElementById('encoded_shift').textContent = '---';
  document.getElementById('encoded_immediate').textContent = '-----';
}

function displayError(s) {
  let e = document.getElementById('encoder_output');
  e.textContent = s;
  e.className = 'error';
}

function fillSpan(value) {
  let i, b, r = 0, m = 0xffffffff, n = m;

  for (i = 0; i < 32; i++) {
    n = rol(value, i);
    if (n < m) {
      r = i;
      m = n;
    }
  }

  m--;
  m |= m >>> 1;
  m |= m >>> 2;
  m |= m >>> 4;
  m |= m >>> 8;
  m |= m >>> 16;
  m = m >>> 0;

  if (m > 0xff) {
    displayError('Rotated constant is too wide');
  } else {
    displayError('Constant requires odd rotation');
  }

  return ror(m, r);
}

function spanError(value) {
  let i, bits = fillSpan(value),
    g = document.getElementById('decoded_bits'),
    r;

  for (i = 0; i < 32; i++) {
    r = g.childNodes[i].childNodes[0];
    if (bits & (1 << (31 - i))) {
      r.setAttribute('class', 'error');
    } else {
      r.setAttribute('class', '');
    }
  }
}

function update() {
  let input = document.getElementById('number_input');
  let value = parseInt(input.value);

  bits(value);

  try {
    let encoded = encode(value),
      shift = (encoded >>> 8) & 0xF;
    encodedBits(encoded);
    input.classList.remove('error');
    span(shift);
  } catch (e) {
    input.classList.add('error');
    encodeError();
    spanError(value);
  }
}

export default function() {
  let form = document.getElementById('arm_immediate_encoding_form');

  form.onsubmit = function () {
    return false;
  };

  document.getElementById('left_button').onclick = function () {
    modify(function (n) {
      return rol(n, 2);
    })
  };

  document.getElementById('right_button').onclick = function () {
    modify(function (n) {
      return ror(n, 2);
    })
  };

  document.getElementById('plus_button').onclick = function () {
    modify(function (n) {
      return n + 1;
    })
  };

  document.getElementById('minus_button').onclick = function () {
    modify(function (n) {
      return n - 1;
    })
  };

  document.getElementById('number_input').onchange = update;
  document.getElementById('number_input').onkeyup = update;
  update();

  let examples = document.getElementById('encoding_examples').children;
  let i;

  function showExample() {
    let input = document.getElementById('number_input');
    input.value = hex(parseInt(this.textContent), 8);
    update();
    return false;
  }

  for (i = 0; i < examples.length; i++) {
    examples[i].onclick = showExample;
  }
}
