declare var $;

export function scrollElementToTop(emt) {
    let inp: any = emt;

    if (inp) {
      inp.focus();

      let cont = $('.container');

      let top = cont[0].scrollTop,
      emtTop = $(inp).offset().top;

      //inp.scrollIntoView({behavior:'smooth', block:'start'})

      if (cont.length && emtTop > top) {


        if (top != 0) {
          cont[0].scrollTop = $(inp).offset().top;
          console.log('Current Top', top, 'emt top', emtTop);
        } else {
          cont[0].scrollTop = $(inp).offset().top/2;
          console.log('Current Top', top, 'emt top', emtTop);
        }
       

      }
    }
  }
