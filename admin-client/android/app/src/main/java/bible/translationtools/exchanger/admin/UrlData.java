package bible.translationtools.exchanger.admin;

import android.content.Context;
import android.net.Uri;
import android.webkit.MimeTypeMap;

import java.io.IOException;
import java.io.OutputStream;

public class UrlData {
    String data = "";
    String mimeType = "text/plain";
    String encoding = "utf-8";
    boolean isBase64 = false;

    public UrlData(String url) {
        this.parse(url);
    }

    public UrlData(String data, String mimeType, String encoding, boolean isBase64) {
        this.data = data;
        this.mimeType = mimeType;
        this.encoding = encoding;
        this.isBase64 = isBase64;
    }

    private void parse(String url) {
        if(url.startsWith("data:")) {
            url = url.replaceFirst("data:", "");
            String[] parts = url.split(",", 2);

            this.data = parts[1];

            if(!parts[0].equals("")) {
                String[] params = parts[0].split(";");
                for (String p : params) {
                    if(p.startsWith("charset=")) {
                        this.encoding = p.substring(8);
                    } else if(p.startsWith("base64")) {
                        this.isBase64 = true;
                    } else if(p.contains("/")) {
                        this.mimeType = p;
                    }
                }
            }
        }
    }

    public String getExtension() {
        String ext = MimeTypeMap.getSingleton().getExtensionFromMimeType(this.mimeType);

        if(ext == null) {
            if(this.mimeType.contains("json")) {
                ext = "json";
            } else {
                ext = "file";
            }
        }

        return ext;
    }

    public void save(Context ctx, Uri uri) throws IOException {
        try(OutputStream os = ctx.getContentResolver().openOutputStream(uri)) {
            os.write(this.data.getBytes(this.encoding));
        }
    }
}
