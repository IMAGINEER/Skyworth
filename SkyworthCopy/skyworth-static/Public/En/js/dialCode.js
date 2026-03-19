var phoneInput;
function getIPData() {
    $.ajax({
        type: 'GET',
        url: 'https://api.ip.sb/geoip/',
        dataType: 'jsonp',
        success: function(response) {
            // console.log(response);
            var IPData = response;
            var countryCode;
            var countryCodeSmall;
            var phoneInputFieldArry = document.querySelectorAll(".ys-form-phone input");
            phoneInputFieldArry.forEach(function(item, index) {
                var phoneInputField = item;
                phoneInput = window.intlTelInput(phoneInputField, {
                    initialCountry: "auto",
                    nationalMode: true,
                    geoIpLookup: getCountryCode,
                    countrySearch: true,
                });
                function getCountryCode(callback) {
                    countryCode = IPData.country_code;
                    var code = $('.ys-form-phone').attr('data-init');
                    // 如果后台填了默认国家显示默认国家
                    if(code){
                        countryCodeSmall = code.toLowerCase(); 
                    }else{
                        // 否则走ajax获取的当前位置
                        countryCodeSmall = countryCode.toLowerCase();
                    }
                    callback(countryCodeSmall);
                };
                setTimeout(function() {
                    var cuntrydialCode = phoneInput.selectedCountryData.dialCode;
                    phoneInputField.value = "+" + cuntrydialCode + " ";
                    ys.mCustomScrollbarInit('.iti__country-list','inside','y');
                }, 1000);
            });
        },
    });
};
window.onload = setTimeout(function() {
    getIPData();   
    $('.ys-form-phone').on('click','.iti__country',function(){
        var num = $(this).attr('data-dial-code');
        console.log(num);
        $(this).parents('.ys-form-phone').find('input').get(1).value= "+" + num + " ";
        var code = $(this).attr('data-country-code');
        var namex = $('.ys-select-li[data-code='+code+']').attr('data-value');
        if(namex && $('.ys-form-inof-country').length>0){
            $('.ys-form-inof-country').find('.ys-select-show').val(namex);
        }
    });
    $('.ys-form-phone').on('click','.iti__selected-flag',function(){
        // $('.iti__country-list').mCustomScrollbar("scrollTo",".iti__active",'top');  
    });
}, 1000);
