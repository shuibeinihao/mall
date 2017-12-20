import $ from 'jquery';

export default function (url, data, method = 'GET', async = true, headers) {
  return new Promise((resolve, reject) => {
    $.ajax({
      method,
      url,
      headers,
      async,
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(data),
      success: resolve,
      error: xhr => {
        try {
          reject(JSON.parse(xhr.responseText));
        } catch (e) {
          reject({ error: true, message: `解析JSON出错: ${xhr.responseText}` });
        }
      }
    });
  });
}
