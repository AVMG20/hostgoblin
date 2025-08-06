import NextTopLoader from "nextjs-toploader";

export function TopLoader() {
    return <NextTopLoader
        initialPosition={0.4}
        template={"<div id=\"nprogress\">\n" +
            "    <div\n" +
            "            class=\"bg-primary/50 fixed z-[5] top-0 left-0 w-full h-[3px]\"\n" +
            "            role=\"bar\"\n" +
            "            style=\"transform: translate3d(-80.557%, 0px, 0px); transition: all 200ms ease 0s;\"\n" +
            "    >\n" +
            "        <div class=\"peg\"></div>\n" +
            "    </div>\n" +
            "    <div class=\"spinner\" role=\"spinner\">\n" +
            "        <div\n" +
            "                class=\"w-[18px] h-[18px] box-border border-2 border-transparent border-t-primary border-l-primary rounded-full animate-spin\"\n" +
            "                role=\"spinner-icon\"\n" +
            "        ></div>\n" +
            "    </div>\n" +
            "</div>"}
    />
}