{
  lib,
  stdenv,
  nix-gitignore,

  yarn-berry,
  nodejs_22,
  cacert,
}: stdenv.mkDerivation (final: let
  nodeModules = stdenv.mkDerivation {
    pname = "${final.pname}-node_modules";
    version = final.version;

    src = final.src;

    nativeBuildInputs = [ nodejs_22 yarn-berry cacert ];

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
      # build will fail once due to missing nodejs executable
      # linking before running this won't work, it will just delete it
      HOME=$(pwd)/garbage-tooling yarn install || true

      mkdir -p node_modules/node/bin
      ln -s ${nodejs_22}/bin/node node_modules/node/bin/node

      HOME=$(pwd)/garbage-tooling yarn install
    '';

    installPhase = ''
      # none of the cache path configs in yarnrc actually do anything
      # so we just copy node_modules manually

      rm node_modules/node/bin/node # remove dep on nix package for output hash
      mv node_modules $out
    '';

    fixupPhase = "true";

    outputHashMode = "recursive";
    outputHashAlgo = "sha256";
    outputHash = "rKoDjvG5t+aQRrzAz0eTifPtL3zmWAu/emxXWd1ocxM=";
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
  '';

  buildPhase = ''
    HOME=$(pwd)/garbage-tooling yarn build
  '';

  installPhase = "mv dist $out";
})
