{
  lib,
  stdenv,
  nix-gitignore,

  yarn-berry,
  nodejs,
  cacert,
  versions ? null,
}: stdenv.mkDerivation (final: let
  nodeModules = stdenv.mkDerivation {
    pname = "${final.pname}-node_modules";
    version = final.version;

    src = final.src;

    nativeBuildInputs = [ nodejs yarn-berry cacert ];

    configurePhase = ''
      mkdir garbage-tooling

      cat <<EOF > .yarnrc.yml
      enableTelemetry: false
      enableInlineBuilds: true
      enableProgressBars: false
      enableGlobalCache: false
      nodeLinker: node-modules
      EOF
    '';

    buildPhase = ''
      HOME=$(pwd)/garbage-tooling yarn install
    '';

    installPhase = ''
      # none of the cache path configs in yarnrc actually do anything
      # so we just copy node_modules manually

      mv node_modules $out
    '';

    fixupPhase = "true";

    outputHashMode = "recursive";
    outputHashAlgo = "sha256";
    outputHash = "V1sjOLi6UOb3HQLiGTcGJInDU7H28fjzdmrxYXXI0ug=";
  };
in {
  pname = "quickshell-web";
  version = "0.1.0";

  src = nix-gitignore.gitignoreSource [] ./.;

  nativeBuildInputs = [ yarn-berry ];

  configurePhase = ''
    mkdir garbage-tooling

    cat <<EOF > .yarnrc.yml
    enableInlineBuilds: true
    enableProgressBars: false
    enableGlobalCache: false
    enableNetwork: false
    nodeLinker: node-modules
    EOF

    cp -r ${nodeModules} node_modules
    chmod +rw -R node_modules
  '';

  PRODUCTION = true;
  VERSION_FILE_PATH = versions;

  buildPhase = ''
    HOME=$(pwd)/garbage-tooling yarn build
  '';

  installPhase = ''
    mkdir -p $out
    mv redirects.caddyfile $out
    mv dist $out/site
  '';
})
