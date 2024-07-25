interface NerdFonts {
    fonts: Font[];
}

interface Font {
    /** Main font name */
    unpatchedName:          string;
    /** Main description */
    description:            string;
    /** `https://github.com/ryanoasis/nerd-fonts/tree/master/patched-fonts/${imagePreviewFontSource}` */
    imagePreviewFontSource: string;

    licenseId:              string;
    RFN:                    boolean;
    version:                string;
    patchedName:            string;
    folderName:             string;
    imagePreviewFont:       string;
    linkPreviewFont:        string | false;
    caskName:               string;
    repoRelease:            boolean;

}
