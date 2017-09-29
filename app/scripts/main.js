'use strict';

$.ajaxSetup({ cache: false });

$(function () {

    const apiUrl = 'http://api-dev.valeriehudak.com';

    /**
     *
     * @type {{getCSRF}}
     */
    const CSRFModule =  (function (jQuery) {

        /**
         *
         * @param element
         * @returns {string}
         */
        const getCSRF = function(element) {
            const jsPromise = Promise.resolve(jQuery.ajax({
                url: apiUrl + '/api/csrf',
                jsonp: 'callback',
                dataType: 'jsonp'
            }));

            jsPromise.then(function (response) {
               element.val(response.csrf);
            });
        };

        return {
            getCSRF: getCSRF
        }
    })($);

    const FormHandlerModule = (function (jQuery) {
        const submitForm = function (form) {
            jQuery.post(
                apiUrl + '/api/form',
                form.serialize(),
                function (data) {
                    alert(JSON.stringify(data));
                }
            );
        };

        return {
            submitForm: submitForm
        }
    })($);

    $('#name').focus(function() {
        if ($('#token').val() === '') {
            CSRFModule.getCSRF($('#token'));
        }
    });

    $('#commentForm').submit(function (e) {
        e.preventDefault();
        FormHandlerModule.submitForm($(this));
    });
});