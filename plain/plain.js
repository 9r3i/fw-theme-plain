

/** require object and method -- plain.init */
window.plain=window.plain||{
  version:'0.5.0',
  data:ForceWebsite.config.theme.config.data,
  site:ForceWebsite.config.site,
  buildElement:ForceWebsite.Force.buildElement,
  init:async function(){
    ForceWebsite.theme.putHTML(ForceWebsite.theme.content);
    let files=[
      "js/others.min.js",
    ];
    //ForceWebsite.theme.loadFiles(files);
    setTimeout(e=>{
      
    },(100*files.length)+300);
  },
  load:function(query,post,bulk){
    let body=document.getElementById('content');
    if(query.hasOwnProperty('p')){
      let pcon=plain.pageContent(post);
      if(pcon){return pcon.outerHTML;}
      return 'Not Found...';
    }
    let pcon=plain.bulkContent(bulk);
    if(pcon){
      setTimeout(e=>{
        plain.more('bulk-button-more');
      },50);
      return pcon.outerHTML;
    }return 'Nothing...';
  },
  pageContent:function(p){
    let ptitle=plain.buildElement('h1',p.title,{
      'class':'page-title',
      'id':'title',
    }),
    ploader=plain.buildElement('div',null,{
      'class':'page-content-loader',
    },[
      plain.buildElement('img',null,{
        'src':ForceWebsite.theme.path+'images/default.loader.gif',
      }),
      document.createTextNode('Loading...'),
    ]),
    img=new Image,
    ppicture=plain.buildElement('div',null,{
      'class':'page-picture',
      'id':'page-picture-'+p.slug,
    }),
    pcontent=plain.buildElement('div',null,{
      'class':'page-content',
      'id':'content',
      'data-id':p.id+'',
    },[ploader]),
    ptime=plain.buildElement('div',p.time,{
      'class':'page-time'
    }),
    page=plain.buildElement('div',null,{
      'class':'page',
    },[
      ptitle,ptime,ppicture,pcontent,
    ]);
    /* image */
    img.src=ForceWebsite.imageURL(p.id);
    img.dataset.pid=p.id;
    img.dataset.slug=p.slug;
    img.onload=function(e){
      let ppid='page-picture-'+this.dataset.slug;
      pp=document.getElementById(ppid);
      if(pp){
        ForceWebsite.clearElement(pp);
        pp.appendChild(img);
      }
    };
    img.onerror=async function(e){
      this.onerror=null;
      this.src=await ForceWebsite.imageURL(this.dataset.pid);
    };
    /* content */
    if(p.hasOwnProperty('content')){
      pcontent.innerHTML=p.content;
    }else{
      this.fetch('website.content',function(r){
        ForceWebsite.data[p.slug]['content']=r;
        pcontent.innerHTML=r;
      },{id:p.id});
    }
    return page;
  },
  bulkContent:function(d){
    let title=plain.buildElement('h1',plain.site.description,{
      'class':'page-title',
      'id':'title',
    }),
    bulk=plain.buildElement('div',null,{
      'class':'bulk',
    },[title]),
    rowCount=0,tmpCount=0;
    for(let i in d){
      if(d[i].type!='text'){
        continue;
      }
      rowCount++;
      let p=d[i],
      img=new Image,
      beslug=plain.buildElement('a',p.title,{
        href:'?p='+p.slug,
      }),
      bepicture=plain.buildElement('div',null,{
        'class':'bulk-each-picture',
        'id':'picture-'+p.slug,
      }),
      betitle=plain.buildElement('div',null,{
        'class':'bulk-each-title',
      },[beslug]),
      betime=plain.buildElement('div',p.time,{
        'class':'bulk-each-time',
      }),
      be=plain.buildElement('div',null,{
        'class':'bulk-each',
        'id':'bulk-each-'+rowCount,
        'data-id':p.id,
        'data-slug':p.slug,
      },[
        betitle,betime,bepicture,
      ]);
      be.appendTo(bulk);
      if(rowCount>ForceWebsite.theme.config.data.limit){
        be.classList.add('bulk-hide');
        tmpCount++;
      }
      /* image */
      img.src=ForceWebsite.imageURL(p.id);
      img.dataset.pid=p.id;
      img.dataset.slug=p.slug;
      img.onload=function(e){
        let bepid='picture-'+this.dataset.slug;
        bep=document.getElementById(bepid);
        if(bep){
          bep.style.backgroundImage="url('"+this.src+"')";
        }
      };
      img.onerror=async function(e){
        this.onerror=null;
        this.src=await ForceWebsite.imageURL(this.dataset.pid);
      };
    }
    if(rowCount<=ForceWebsite.theme.config.data.limit){
      return bulk;
    }
    /* load more data */
    let butMore=plain.buildElement('button','More',{
      'class':'bulk-button',
      'data-count':ForceWebsite.theme.config.data.limit+'',
      'data-total':rowCount+'',
      'id':'bulk-button-more',
    }),
    be=plain.buildElement('div',null,{
      'class':'bulk-each-down',
    },[butMore]);
    be.appendTo(bulk);
    return bulk;
  },
  more:function(id){
    let butMore=document.getElementById(id);
    if(!butMore){return;}
    butMore.addEventListener('click',function(e){
      let rowCount=parseInt(this.dataset.count),
      rowTotal=parseInt(this.dataset.total),
      rowLimit=plain.data.limit+rowCount;
      for(let i=0;i<plain.data.limit;i++){
        rowCount++;
        let be=document.getElementById('bulk-each-'+rowCount);
        if(be){
          be.classList.remove('bulk-hide');
        }
      }
      if(rowCount>=rowTotal){
        let tp=this.parentElement;
        tp.parentElement.removeChild(tp);
        return;
      }
      this.dataset.count=rowCount+'';
    },false);
  },
};
