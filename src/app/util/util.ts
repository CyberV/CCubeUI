declare var $;


export function scrollToBottom() {
  let cont = $('.container');
  cont[0].scrollTop = 2000;
}

export function scrollElementToTop(emt) {
  let inp: any = emt;

  if (inp) {
    
    try {
      inp.focus();
    } catch (e) {

    }

    let cont = $('.container');

    let top = cont[0].scrollTop,
      emtTop = $(inp).offset().top;



    if (cont.length && emtTop > top) {


      if (top != 0) {
        cont[0].scrollTop = $(inp).offset().top;
        console.log('Current Top', top, 'emt top', emtTop);
      } else {
        cont[0].scrollTop = $(inp).offset().top - 100;
        console.log('Current Top', top, 'emt top', emtTop);
        //inp.scrollIntoView({behavior:'smooth', block:'start'})
      }




    }
  }
}
