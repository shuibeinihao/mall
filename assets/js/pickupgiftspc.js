import $ from 'jquery';
import { CLICK_NAME } from './helper/_tap';

/* 地区选择 */
const $province = $('.js-province');
const $city = $('.js-city');
const $district = $('.js-district');
const data = window.AREA;

const provinceChange = () => {
  const province = $province.val();
  const provinceData = data[province];
  const cities = Object.keys(provinceData);
  const districts = provinceData[cities[0]];
  renderCity(cities);
  renderDistrict(districts);
};

const renderCity = (cities) => {
  $city.html(cities.map(city => `<option>${city}</option>`));
};

const renderDistrict = (districts) => {
  $district.html(districts.map(district => `<option>${district}</option>`));
};

$city.change(() => {
  const province = $province.val();
  const city = $city.val();
  renderDistrict(data[province][city]);
});

$province.change(provinceChange);
provinceChange();

/* 提交处理 */
$('#phoneEl').keypress(evt => {
  const code = evt.which || evt.keyCode;
  if (!(code >= 48 && code <= 57)
    && code != 8
    && code != 9
    && code != 10 && code != 13
    && (code < 37 || code > 40)) {
    evt.preventDefault();
  }
});

$('.js-form').submit(evt => {
  evt.preventDefault();
  if (['nameEl', 'phoneEl', 'addressEl'].some(checkError)) {
    return;
  }

  $.ajax({
    method: 'POST',
    url: '/api/trade/gift/submit-gift',
    dataType: 'json',
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      address: `${$province.val()}${$city.val()}${$district.val()}${$('#addressEl').val().trim()}`,
      phone: $('#phoneEl').val().trim(),
      name: $('#nameEl').val().trim(),
      organization: evt.target.organization.value,
      id: evt.target.id.value,
      sign: evt.target.sign.value
    }),
    success: (result) => {
      if (result.success) {
        location.href = '/pickupgifts/ok';
      } else {
        if (result.retCode < 0) {
          location.href = '/pickupgifts/fail';
        } else {
          showError(result.retMsg);
        }
      }
    }, error: () => showError('网络错误，请稍后重试！')
  });
});

function checkError(id) {
  const $input = $(`#${id}`);
  if (!$input.val().trim()) {
    $input.addClass('error');
    $input.one('focus', () => {
      $input.removeClass('error');
    });
    return true;
  }
}

/* 错误对话框 */
$('.js-dialog-ok').on(CLICK_NAME, () => {
  $('.js-dialog').addClass('hidden');
});

function showError(error) {
  $('.js-dialog')
    .removeClass('hidden')
    .find('.js-dialog-msg')
    .html(error);
}
