import cssModule from "@vercel/turbopack-next/internal/font/local/cssmodule.module.css?{%22path%22:%22layout.tsx%22,%22import%22:%22%22,%22arguments%22:[{%22src%22:%22./fonts/glide-orwate.italic.otf%22,%22variable%22:%22--font-glide%22,%22display%22:%22swap%22}],%22variableName%22:%22glideOrwate%22}";
const fontData = {
    className: cssModule.className,
    style: {
        fontFamily: "'glideOrwate', 'glideOrwate Fallback'",
        
    },
};

if (cssModule.variable != null) {
    fontData.variable = cssModule.variable;
}

export default fontData;
