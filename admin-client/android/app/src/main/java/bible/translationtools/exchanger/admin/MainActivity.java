package bible.translationtools.exchanger.admin;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.pm.ApplicationInfo;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.webkit.*;
import android.widget.Toast;

import java.io.IOException;

public class MainActivity extends Activity {

    private WebView webView;
    private ChromeBrowser browser;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        setRequestedOrientation (ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);

        if (0 != (getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE)) {
            WebView.setWebContentsDebuggingEnabled(true);
        }

        init();
    }

    private void init() {
        browser = new ChromeBrowser(MainActivity.this);
        webView = findViewById(R.id.web_view);

        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(browser);
        webView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent,
                                        String contentDisposition, String mimetype,
                                        long contentLength) {

                if(url.contains("data")) {
                    browser.urlData = new UrlData(Uri.decode(url));
                    Intent i = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                    i.putExtra(Intent.EXTRA_TITLE, "file." + browser.urlData.getExtension());
                    i.setType(browser.urlData.mimeType);
                    startActivityForResult(i, ChromeBrowser.FILESAVER_RESULTCODE);
                } else {
                    Intent i = new Intent(Intent.ACTION_VIEW);
                    i.setData(Uri.parse(url));
                    startActivity(i);
                }
            }
        });

        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setAllowUniversalAccessFromFileURLs(true);
        webSettings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        webSettings.setMixedContentMode(0);
        webSettings.setUserAgentString(webSettings.getUserAgentString() + " TranslationExchangeClient");

        webView.loadUrl("file:///android_asset/build/index.html");
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            hideSystemUI();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent intent) {
        super.onActivityResult(requestCode, resultCode, intent);

        if(resultCode != RESULT_OK) return;

        if (requestCode == ChromeBrowser.FILECHOOSER_RESULTCODE) {
            if (null == browser.mUploadMessages) {
                return;
            }
            browser.handleUploadMessages(resultCode, intent);
        } else if(requestCode == ChromeBrowser.FILESAVER_RESULTCODE) {
            try {
                Uri fileUri = intent.getData();
                browser.urlData.save(this, fileUri);

                Toast.makeText(this, R.string.saved_success, Toast.LENGTH_SHORT);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private void hideSystemUI() {
        View decorView = getWindow().getDecorView();
        decorView.setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_IMMERSIVE
                        // Set the content to appear under the system bars so that the
                        // content doesn't resize when the system bars hide and show.
                        | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        // Hide the nav bar and status bar
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_FULLSCREEN);
    }
}


