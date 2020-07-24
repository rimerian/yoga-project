window.addEventListener('DOMContentLoaded', function() {

    'use strict';
    let tab = document.querySelectorAll('.info-header-tab'),
        info = document.querySelector('.info-header'),
        tabContent = document.querySelectorAll('.info-tabcontent');
        
    function hideTabContent(a) {
        for (let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
        }
    }

    hideTabContent(1);

    function showTabContent(b) {
        if (tabContent[b].classList.contains('hide')) {
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
        }
    }

    info.addEventListener('click', function(event) {
        let target = event.target;
        if (target && target.classList.contains('info-header-tab')) {
            for(let i = 0; i < tab.length; i++) {
                if (target == tab[i]) {
                     hideTabContent(0);
                     showTabContent(i);
                     break;
                }
            }
        }
    });

    //Timer

    let deadline = '2020-07-30T00:00:00';

    function getTimeRemaining(endtime) {
        let t  = Date.parse(endtime) - Date.parse(new Date()),
            seconds = Math.floor((t/1000) % 60),
            minutes = Math.floor((t/1000)/60 % 60),
            hours = Math.floor(t/(1000*60*60));

        return {
            'total' : t,
            'seconds' : seconds,
            'minutes' : minutes,
            'hours' : hours
        };
    }

    function setClock(id, endtime) {
        let timer = document.getElementById(id),
            hours = timer.querySelector('.hours'),
            minutes = timer.querySelector('.minutes'),
            seconds =  timer.querySelector('.seconds'),
            timeInterval = setInterval(updateClock, 1000);

        function updateClock() {
            let t = getTimeRemaining(endtime);
            
            function addZero(num) {
                if (num <= 9) {
                    return '0' + num; 
                } else return num;
            }

            hours.textContent = addZero(t.hours);
            minutes.textContent = addZero(t.minutes);
            seconds.textContent = addZero(t.seconds);



            if (t.total <= 0) {
                clearInterval(timeInterval);
                hours.textContent = '00';
                minutes.textContent = '00';
                seconds.textContent = '00';
            }
        }
    }

    setClock('timer', deadline);

    //Modal

    let more = document.querySelector('.more'),
        overlay = document.querySelector('.overlay'),
        close = document.querySelector('.popup-close'),
        tabMoreBtns = document.querySelectorAll('.description-btn'),
        index, tempBtn;

        more.addEventListener('click', function() {
            overlay.style.display = 'block';
            this.classList.add('more-splash');
            document.body.style.overflow = 'hidden';
        });

        for (index = 0; index < tabMoreBtns.length; index++) {
            tempBtn = tabMoreBtns[index];
            tempBtn.addEventListener('click', function () {
                overlay.style.display = 'block';
                this.classList.add('more-splash');
                document.body.style.overflow = 'hidden';
                event.preventDefault();
            });
        }

        close.addEventListener('click', function() {
            overlay.style.display = 'none';
            more.classList.remove('more-splash');
            for (index = 0; index < tabMoreBtns.length; index++){
                tabMoreBtns[index].classList.remove('more-splash');
            }
            document.body.style.overflow = '';
        });

    // Form

    let message = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с вами свяжемся!',
        failure: 'Что-то пошло не так...'         
    };

    let form = document.querySelector('.main-form'),
        formBottom = document.getElementById('form'),
        input = document.getElementsByTagName('input'),
        statusMessage = document.createElement('div');

        statusMessage.classList.add('status');

    function sendForm(elem) {                               //Отправка данных форм с использованием promise и AJAX
        elem.addEventListener('submit', function(event) {
            event.preventDefault();
            elem.appendChild(statusMessage);
            let formData = new FormData(elem);

            function postData(data) {

                return new Promise(function(resolve,reject) {
                    let request = new XMLHttpRequest();
                    request.open('POST', '../server.php');

                    request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

                    request.onreadystatechange = function() {
                        if (request.readyState < 4) {
                            resolve()                                                
                        } else if(request.readyState === 4 && request.status == 200) {
                            resolve()
                        } else {
                            reject()
                        }
                    };
                    request.send(data);
                });
            } //End of postData
            function clearInput() {
                for (let i = 0; i < input.length; i++) {
                    input[i].value = '';
                }                
            }

            postData(formData)                                                  // Получение статуса через promise
                .then(()=> statusMessage.innerHTML = message.loading)
                .then(()=> statusMessage.innerHTML = message.success)
                .catch(()=> statusMessage.innerHTML = message.failure)
                .then(clearInput)
                .then(setTimeout((()=> statusMessage.innerHTML = ''), 10000)); // Автоматическое очищение статуса через 10 сек
        });
    }

    sendForm(form);
    sendForm(formBottom);

    //Slider

    let slideIndex = 1,
        slides = document.querySelectorAll('.slider-item'),
        prev = document.querySelector('.prev'),
        next = document.querySelector('.next'),
        dotsWrap = document.querySelector('.slider-dots'),
        dots = document.querySelectorAll('.dot')

    showSlides(slideIndex);
    function showSlides(n) {

        if (n > slides.length) {
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = slides.length;
        }

        slides.forEach((item) => item.style.display = 'none');
        dots.forEach((item) => item.classList.remove('dot-active'));

        slides[slideIndex - 1].style.display = 'block';
        dots[slideIndex - 1].classList.add('dot-active');
    }

    function plusSlides(n) {
        showSlides(slideIndex += n)
    }
    function currentSlide(n) {
        showSlides(slideIndex = n);
    }

    prev.addEventListener('click', function() {
        plusSlides(-1);
    });

    next.addEventListener('click', function() {
        plusSlides(1);
    });

    dotsWrap.addEventListener('click', function() {
        for (let i = 0; i < dots.length + 1; i++) {
            if (event.target.classList.contains('dot') && event.target == dots[i-1]) {
                currentSlide(i);
            }
        }
    });
});   

            /*  //Formatting data to json
            let obj = {};
            formData.forEach(function(value,key) {
                obj [key] = value;
            });
            let json = JSON.stringify(obj);

            request.send(json); */

                