{
  pkgs ? import <nixpkgs> {},
  quickshell-web ? pkgs.callPackage ./default.nix {},
}: pkgs.mkShell {
  inputsFrom = [ quickshell-web ];

  nativeBuildInputs = [ (pkgs.writeShellScriptBin "yarn-install-hack" ''
    set -x
    yarn install || true
    mkdir -p node_modules/node/bin
    ln -sf ${pkgs.nodejs}/bin/node node_modules/node/bin/node
    yarn install
  '') ];

  YARN_NODE_LINKER = "node-modules";
}
