{
  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";

    quickshell-docs = {
      url = "git+https://git.outfoxxed.me/quickshell/quickshell-docs";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, quickshell-docs }: let
    forEachSystem = fn: nixpkgs.lib.genAttrs
      [ "x86_64-linux" "aarch64-linux" ]
      (system: fn system nixpkgs.legacyPackages.${system});
  in {
    packages = forEachSystem (system: pkgs: rec {
      quickshell-web = pkgs.callPackage ./default.nix {
        quickshell-types = quickshell-docs.packages.${system}.quickshell-types;
      };

      default = quickshell-web;
    });
  };
}
