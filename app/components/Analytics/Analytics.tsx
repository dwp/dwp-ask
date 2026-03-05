import Script from "next/script";

export default function Analytics() {
  return (
    <>
      <Script strategy="beforeInteractive" id="g-analytics-heroku">
        {`
        dataLayer = [{
        'gtm.allowlist': ['gaawc', 'gaawe', 'ua', 'cl', 'lcl', 'fsl', 'tl', 'jel', 'hl', 'v', 'c', 'ctv', 'e', 'dbg', 'd', 'f', 'j', 'smm', 'r' ,'u', 'gas', 'remm', 'vis', 'evl' , 'sdl', 'opt' ]
        }];
        `}
      </Script>{" "}
      <Script id="gtm-script" strategy="beforeInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];
        w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),
        dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-53V37X4L');`}
      </Script>
    </>
  );
}
