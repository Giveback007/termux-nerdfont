type TableDataItem = { id: string, row: (str | num | bol)[] };

interface NerdFonts_1 {
    fonts: Font_1[];
}

interface Font_1 {
    /** Main font name */
    unpatchedName:          string;
    /** Main description */
    description:            string;
    /** `https://github.com/ryanoasis/nerd-fonts/tree/master/patched-fonts/${imagePreviewFontSource}` */
    imagePreviewFontSource: string;
    /** Essentially an 'id' */
    caskName:               string;

    licenseId:              string;
    RFN:                    boolean;
    version:                string;
    patchedName:            string;
    folderName:             string;
    imagePreviewFont:       string;
    linkPreviewFont:        string | false;
    repoRelease:            boolean;
}


interface GithubFile {
    name:         string;
    path:         string;
    sha:          string;
    size:         number;
    url:          string;
    html_url:     string;
    git_url:      string;
    download_url: null;
    type:         Type;
    _links:       Links;
}

interface Links {
    self: string;
    git:  string;
    html: string;
}

enum Type {
    Dir = "dir",
    File = "file",
}
