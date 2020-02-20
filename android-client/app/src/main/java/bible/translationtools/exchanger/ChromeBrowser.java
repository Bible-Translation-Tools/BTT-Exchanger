package bible.translationtools.exchanger;

import android.annotation.TargetApi;
import android.content.ClipData;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.support.v4.app.FragmentActivity;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebView;

public class ChromeBrowser extends WebChromeClient {
    public static final int FILECHOOSER_RESULTCODE   = 1;
    protected ValueCallback<Uri[]> mUploadMessages;
    private MainActivity activity;

    public ChromeBrowser(Context c) {
        activity = (MainActivity) c;
    }

    @Override
    public void onPermissionRequest(final PermissionRequest request) {
        activity.runOnUiThread(new Runnable() {
            @TargetApi(Build.VERSION_CODES.LOLLIPOP)
            @Override
            public void run() {
                request.grant(request.getResources());
            }
        });
    }

    @Override
    public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
        mUploadMessages = filePathCallback;
        openZipChooser();
        return true;
    }

    private void openZipChooser() {
        Intent i = new Intent(Intent.ACTION_GET_CONTENT);
        i.addCategory(Intent.CATEGORY_OPENABLE);
        i.setType("*/*");

        Intent chooserIntent = Intent.createChooser(i, "Zip File Chooser");
        activity.startActivityForResult(chooserIntent, FILECHOOSER_RESULTCODE);
    }

    protected void handleUploadMessages(int resultCode, Intent intent) {
        Uri[] results = null;
        try {
            if (resultCode != FragmentActivity.RESULT_OK) {
                results = null;
            } else {
                if (intent != null) {
                    String dataString = intent.getDataString();
                    ClipData clipData = intent.getClipData();
                    if (clipData != null) {
                        results = new Uri[clipData.getItemCount()];
                        for (int i = 0; i < clipData.getItemCount(); i++) {
                            ClipData.Item item = clipData.getItemAt(i);
                            results[i] = item.getUri();
                        }
                    }
                    if (dataString != null) {
                        results = new Uri[]{Uri.parse(dataString)};
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        mUploadMessages.onReceiveValue(results);
        mUploadMessages = null;
    }
}
