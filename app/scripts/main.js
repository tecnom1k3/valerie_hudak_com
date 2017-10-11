'use strict';

$.ajaxSetup({ cache: false });

$(function () {

    const apiUrl = '{{API_ENDPOINT}}';

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
            jQuery('#modalWait').modal('show');

            const jsPromise = Promise.resolve(jQuery.ajax({
                url: apiUrl + '/api/form',
                jsonp: 'callback',
                dataType: 'json',
                type: 'POST',
                crossDomain: true,
                data: form.serialize()
            }));

            jsPromise.then(function (data) {
                jQuery('#modalWait').modal('hide');
                if (data.success) {
                    jQuery('#modalSuccess').modal('show');
                } else {
                    jQuery('#modalError').modal('show');
                }
            }, function (reason) {
                jQuery('#modalWait').modal('hide');
                jQuery('#modalError').modal('show');
            });
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
        grecaptcha.reset();
    });
});