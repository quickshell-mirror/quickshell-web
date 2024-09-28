{
  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }: let
    forEachSystem = fn: nixpkgs.lib.genAttrs
      [ "x86_64-linux" "aarch64-linux" ]
      (system: fn system nixpkgs.legacyPackages.${system});
  in {
    packages = forEachSystem (system: pkgs: rec {
      quickshell-web = pkgs.callPackage ./default.nix {};
      default = quickshell-web;
    });
  };
}
